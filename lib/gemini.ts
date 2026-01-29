import { GoogleGenerativeAI } from "@google/generative-ai";
import { trackGemini } from "opik-gemini";

// Standard Gemini SDK
// Explicitly setting the version can solve 404 issues
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Official Opik wrapper
// Note: Opik wraps the genAI instance. 
// Ensure your @google/generative-ai version is ^0.12.0
export const trackedGenAI = trackGemini(genAI, {
    projectName: process.env.OPIK_PROJECT_NAME || "Zavn",
});