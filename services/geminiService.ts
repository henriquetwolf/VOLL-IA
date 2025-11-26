import { GoogleGenAI } from "@google/genai";
import { Studio } from "../types";

// Note: In a real production app, never expose API keys on the client side.
// This is strictly for the requested demo environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (
  message: string, 
  studioContext: Studio | null
): Promise<string> => {
  try {
    const studioInfo = studioContext 
      ? `O usuário é dono de um estúdio de Pilates chamado "${studioContext.name || 'Sem nome'}" localizado em "${studioContext.address || 'Local não informado'}".`
      : 'O usuário é um dono de estúdio de Pilates.';

    const systemInstruction = `
      Você é um consultor sênior especializado em gestão de estúdios de Pilates e bem-estar.
      ${studioInfo}
      Responda de forma concisa, profissional e motivadora.
      Use formatação Markdown para listas ou ênfase.
      O idioma deve ser Português do Brasil.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Desculpe, não consegui processar sua solicitação no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Houve um erro ao conectar com o assistente inteligente. Verifique sua chave de API ou tente novamente mais tarde.";
  }
};