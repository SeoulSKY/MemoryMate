import {GoogleGenerativeAI} from "@google/generative-ai";

if (process.env.EXPO_PUBLIC_GEMINI_TOKEN === undefined) {
  throw new Error("Missing Gemini AI Token");
}

export const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_TOKEN);
