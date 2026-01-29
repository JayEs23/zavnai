import { NextRequest, NextResponse } from "next/server";
import { trackedGenAI } from "@/lib/gemini";
import { Opik } from "opik";

// Lazy initialize Opik to avoid reading env vars at module load time
let opikInstance: Opik | null = null;

function getOpik(): Opik | null {
    // Only initialize if OPIK_API_KEY is available
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
        const { messages, userContext } = await req.json();

        const systemPrompt = `
            You are Echo, the Reflection Agent for ZAVN.
            Your goal is to act as a mirror for the user, helping them understand their own behavioral patterns.
            
            User Context:
            - Goal: ${userContext?.primary_goal || "General personal growth"}
            - Known Patterns: ${userContext?.top_patterns?.join(", ") || "None identified yet"}
            
            Interaction Style:
            1. Socratic: Ask deep, open-ended questions.
            2. BRIEF: Keep responses under 3 sentences unless explaining a complex pattern.
            3. Validating: Acknowledge feelings but keep focus on the gap between intent and action.
        `;

        console.log("Echo Agent Call:", { messageCount: messages.length });

        const model = trackedGenAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt,
        });

        // Gemini expects 'model' instead of 'assistant'
        const contents = messages.map((m: { role: string; content?: string; text?: string }) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content || m.text || "" }],
        }));

        console.log("Gemini Request Contents:", JSON.stringify(contents, null, 2));

        const result = await model.generateContent({ contents });
        const text = result.response.text();

        console.log("Gemini Response Success");

        return NextResponse.json({
            role: "model",
            content: text,
            success: true,
        });
    } catch (error) {
        console.error("Echo Agent Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to generate reflection", details: errorMessage },
            { status: 500 }
        );
    } finally {
        // Ensure traces are sent (only if Opik is initialized)
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