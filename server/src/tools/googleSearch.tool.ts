import { DynamicTool } from "@langchain/core/tools";
// FIX: The correct class name is GoogleGenAI, not GoogleGenerativeAI.
import { GoogleGenAI } from "@google/genai";
import type { GroundingSource } from "../types";

let ai: GoogleGenAI | null = null;
const getAiClient = () => {
    if (!ai) {
        // FIX: The correct class name is GoogleGenAI, not GoogleGenerativeAI.
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    }
    return ai;
}

/**
 * A tool that uses the Gemini Flash model with Google Search grounding
 * to find recent information online. This is used by the main LangGraph agent.
 */
export const webSearchTool = new DynamicTool({
    name: "web-search",
    description: "Searches the web for recent and up-to-date information on a given topic. Use this for questions about current events, news, or anything that requires the latest information.",
    func: async (input: string): Promise<string> => {
        try {
            const client = getAiClient();
            
            const response = await client.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Provide a concise answer and a list of sources for the following query: ${input}`,
                config: {
                    tools: [{ googleSearch: {} }],
                }
            });
            
            const text = response.text;
            let sources: GroundingSource[] = [];

            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                sources = groundingChunks.map((chunk: any) => (
                    chunk.web ? {
                        uri: chunk.web.uri,
                        title: chunk.web.title,
                    } : null
                )).filter((source: GroundingSource | null): source is GroundingSource => source !== null && !!source.uri && !!source.title);
            }
            
            const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());
            
            const result = {
                answer: text,
                sources: uniqueSources,
            };

            return JSON.stringify(result);

        } catch (error) {
            console.error("Error performing web search:", error);
            return "Sorry, I was unable to perform the search. Please try again.";
        }
    },
});