import {GoogleGenerativeAI} from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(
  process.env.EXPO_PUBLIC_GEMINI_TOKEN || "undefined");
