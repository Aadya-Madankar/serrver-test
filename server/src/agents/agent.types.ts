export interface LiveConfig {
    systemInstruction: string;
    voiceName: string;
}

export interface AgentConfig {
    name: string;
    chatPrompt: string;
    live: LiveConfig;
    model?: string;
}
