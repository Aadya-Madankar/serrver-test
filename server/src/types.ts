import type { FunctionDeclaration } from "@google/genai";

export interface MessagePart {
    text: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: MessagePart[];
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface StreamResponse {
    textChunk?: string;
    sources?: GroundingSource[];
}

export interface ITool {
    definition: FunctionDeclaration;
    execute(args: any): Promise<any>;
}
