import { RANI_BHAT_CHAT_PROMPT, RANI_BHAT_VOICE_PROMPT } from '../../constants';
import type { AgentConfig } from '../agent.types';

export const raniAgentConfig: AgentConfig = {
    name: 'Rani Bhat',
    chatPrompt: RANI_BHAT_CHAT_PROMPT,
    live: {
        systemInstruction: RANI_BHAT_VOICE_PROMPT,
        voiceName: 'Laomedeia', // A voice that fits the persona
    },
    model: 'gemini-2.5-pro',
};