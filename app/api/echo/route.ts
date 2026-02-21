import { NextRequest, NextResponse } from "next/server";
import { SchemaType } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getGeminiModel } from "@/lib/gemini";
import type { Session } from "next-auth";

export async function POST(req: NextRequest) {
    try {
        // Get session with proper typing
        const session = await getServerSession(authOptions) as Session | null;
        
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
        }

        const { messages, isOnboarding } = await req.json();

        const systemInstruction = isOnboarding 
            ? `
            # ROLE
            You are the ZAVN Echo Onboarding Agent. Your goal is to move the user from "Intent" to "Action" in under 3 minutes while silently profiling their lifestyle for personalization.

            # PERSONALITY
            - Warm, high-agency, and slightly provocative. 
            - You ask: "What is the one thing you're avoiding that, if finished, would make today a win?"

            # DISCOVERY GOALS
            1. The Gap: What is the specific action they are avoiding?
            2. The Friction: WHY are they avoiding it?
            3. The Rhythm: Infer their energy levels.
            4. The Persona: Infer their professional context.

            # OPERATIONAL RULES
            - Once a goal is identified, trigger the save_commitment tool.
            - Ask ONE question about their support system: "Who is the one person who wouldn't let you off the hook for this?"

            # GUARDRAILS
            - Never sound like a therapist. Sound like a high-performance coach.
            `
            : `You are Echo, the Reflection Agent for ZAVN. Act as a mirror for the user.`;

        const model = getGeminiModel({ 
            systemInstruction,
        });

        const chat = model.startChat({
            history: messages.length > 1 
                ? messages.slice(0, -1).map((m: any) => ({
                    role: m.role === "user" ? "user" : "model",
                    parts: [{ text: m.content || m.text || "" }],
                }))
                : [],
            tools: [
                {
                    functionDeclarations: [
                        {
                            name: "save_commitment",
                            description: "Saves a high-stakes commitment to the database.",
                            parameters: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    goal_title: { type: SchemaType.STRING },
                                    task_detail: { type: SchemaType.STRING },
                                    due_at: { type: SchemaType.STRING },
                                    stake_amount: { type: SchemaType.NUMBER }
                                },
                                required: ["goal_title", "task_detail", "due_at"]
                            }
                        }
                    ]
                }
            ]
        });

        const lastMessage = messages[messages.length - 1].content || messages[messages.length - 1].text;
        
        const prompt = lastMessage === "START_SESSION" 
            ? "The user has just joined. Introduce yourself as Echo and start the onboarding discovery. Do not wait for a user message to begin."
            : lastMessage;

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        
        const functionCalls = response.functionCalls();
        if (functionCalls) {
            for (const call of functionCalls) {
                if (call.name === "save_commitment") {
                    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agents/save-commitment`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${(session as any).accessToken}`
                        },
                        body: JSON.stringify(call.args)
                    });
                    const data = await backendRes.json();
                    
                    const finalResult = await chat.sendMessage([{
                        functionResponse: {
                            name: "save_commitment",
                            response: data
                        }
                    }]);
                    return NextResponse.json({
                        content: finalResult.response.text(),
                        success: true
                    });
                }
            }
        }

        return NextResponse.json({
            content: response.text(),
            success: true,
        });

    } catch (error: any) {
        console.error("Gemini Proxy Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
