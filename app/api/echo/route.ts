import { NextRequest, NextResponse } from "next/server";
import { trackedGenAI } from "@/lib/gemini";
import { Opik } from "opik";

const opik = new Opik();

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
        const contents = messages.map((m: any) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content || m.text }],
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
    } catch (error: any) {
        console.error("Echo Agent Error:", error);
        return NextResponse.json(
            { error: "Failed to generate reflection", details: error.message },
            { status: 500 }
        );
    } finally {
        // Ensure traces are sent
        await opik.flush();
    }
}