import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Opik } from "opik";

// Lazy initialize Opik to avoid reading env vars at module load time
let opikInstance: Opik | null = null;

function getOpik(): Opik | null {
    if (!process.env.OPIK_API_KEY) {
        return null;
    }
    if (!opikInstance) {
        try {
            opikInstance = new Opik();
        } catch (error) {
            console.warn("Failed to initialize Opik:", error);
            return null;
        }
    }
    return opikInstance;
}

export async function POST(req: NextRequest) {
    try {
        // 1. Check API Key
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not set");
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured", details: "Please set GEMINI_API_KEY in your environment variables" },
                { status: 500 }
            );
        }

        const { messages, userContext } = await req.json();

        // 2. Validate request
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "Invalid request", details: "Messages array is required and must not be empty" },
                { status: 400 }
            );
        }

        // 3. Determine specific logic (Goal Refinement vs Reflection)
        const isGoalRefinement = messages.some(m => 
            m.content?.includes("Refine this goal") || 
            m.content?.includes("SMART goal") ||
            m.content?.includes("refined goal")
        );

        // PRESERVED ORIGINAL PROMPTS
        const systemPrompt = isGoalRefinement
            ? `You are Doyn, the Goal Architect for ZAVN. Your role is to transform vague intentions into clear, actionable SMART goals.

            Your task:
            - Take the user's vague goal and make it SPECIFIC (clear action verbs, concrete details)
            - Make it MEASURABLE (include numbers, metrics, or observable outcomes)
            - Ensure it's ACHIEVABLE (realistic given the context)
            - Make it RELEVANT (aligned with their stated intent)
            - Add TIME-BOUND elements (deadlines, milestones, or timeframes)

            Output format:
            - Provide ONLY the refined goal statement
            - Be direct and actionable
            - Use clear, specific language
            - Include measurable criteria if possible
            - Do NOT ask questions, reflect, or provide commentary
            - Just give the refined goal

            Example transformations:
            - "Get more users" → "Acquire 100 new registered users through organic marketing channels within 90 days"
            - "Be healthier" → "Reduce daily sugar intake to under 25g and complete 3 strength training sessions per week for the next 30 days"
            - "Learn coding" → "Complete 2 interactive coding tutorials per week and build 1 small project per month for the next 6 months"`

            : `You are Echo, the Reflection Agent for ZAVN.
            Your goal is to act as a mirror for the user, helping them understand their own behavioral patterns.
            
            User Context:
            - Goal: ${userContext?.primary_goal || "General personal growth"}
            - Known Patterns: ${userContext?.top_patterns?.join(", ") || "None identified yet"}
            
            Interaction Style:
            1. Socratic: Ask deep, open-ended questions.
            2. BRIEF: Keep responses under 3 sentences unless explaining a complex pattern.
            3. Validating: Acknowledge feelings but keep focus on the gap between intent and action.
        `;

        // 4. Format messages for Gemini (map 'assistant' to 'model')
        const contents = messages.map((m: { role: string; content?: string; text?: string }) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content || m.text || "" }],
        }));

        // 5. Model Fallback Logic - Use direct GoogleGenerativeAI to avoid Opik wrapper API version issues
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
        let lastError: Error | null = null;
        let text: string | null = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`[Echo Agent] Attempting ${modelName}...`);
                // Use direct SDK without Opik wrapper to avoid API version conflicts
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: systemPrompt,
                });
                
                const result = await model.generateContent({ contents });
                text = result.response.text();
                
                if (text) {
                    console.log(`[Echo Agent] Success with ${modelName}`);
                    break; 
                }
            } catch (error: any) {
                const errorMsg = error?.message || String(error);
                console.warn(`[Echo Agent] ${modelName} failed:`, errorMsg);
                lastError = error instanceof Error ? error : new Error(String(error));
                continue; 
            }
        }

        if (!text) {
            throw new Error(
                `Failed to generate content with any Gemini model. Last error: ${lastError?.message || "Unknown error"}. ` +
                `Tried models: ${modelsToTry.join(", ")}`
            );
        }

        return NextResponse.json({
            role: "model",
            content: text,
            success: true,
        });

    } catch (error: any) {
        console.error("Echo Agent Route Error:", error);
        
        return NextResponse.json(
            { 
                error: "Failed to generate reflection", 
                details: error.message,
                ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
            },
            { status: 500 }
        );
    } finally {
        // Ensure traces are sent to Opik
        const opik = getOpik();
        if (opik) {
            try {
                await opik.flush();
            } catch (error) {
                console.warn("Failed to flush Opik traces:", error);
            }
        }
    }
}