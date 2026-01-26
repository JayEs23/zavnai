import { GoogleGenerativeAI } from "@google/generative-ai";
import { trackGemini } from "opik-gemini";

// Standard Gemini SDK - Used for server-side Text updates
// Use server-side env vars (GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Official Opik wrapper for the generative-ai SDK
export const trackedGenAI = trackGemini(genAI, {
    projectName: process.env.OPIK_PROJECT_NAME || "Zavn",
});
