import { GoogleGenerativeAI, ModelParams } from "@google/generative-ai";
import { trackGemini } from "opik-gemini";

// Standard Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Official Opik wrapper
export const trackedGenAI = trackGemini(genAI, {
    projectName: process.env.OPIK_PROJECT_NAME || "Zavn",
});

/**
 * Centralized helper to get a Gemini model with a stable version.
 * Uses environment variables if available, otherwise falls back to a known stable version.
 */
export const getGeminiModel = (params: Omit<ModelParams, 'model'> & { model?: string }) => {
    const modelName = params.model || process.env.GEMINI_MODEL_STABLE || "gemini-2.5-flash";
    return trackedGenAI.getGenerativeModel({
        ...params,
        model: modelName,
    });
};
