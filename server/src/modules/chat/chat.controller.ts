// FIX: Added the main express import to enable module augmentation for Request and Response types.
import express from 'express';
// FIX: Use regular import for Express types to ensure proper type resolution.
// FIX: Changed `import type` to a regular `import` for Express types. This corrects the type inference for Request and Response objects, making properties like `.params`, `.body`, and `.status` available and resolving type errors.
import { Request, Response } from 'express';
import { agentRegistry } from '../../agents/agent.registry';
import { generateChatStream } from './chat.service';
import type { ChatMessage } from '../../types';

export const streamChat = async (req: Request, res: Response) => {
    try {
        const { agentName } = req.params;
        const agentConfig = agentRegistry.get(agentName);
        
        if (!agentConfig) {
            // This should technically be caught by the middleware, but as a safeguard:
            return res.status(404).json({ error: `Agent "${agentName}" not configured.` });
        }

        const { prompt, history } = req.body;

        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ error: 'Prompt is required and must be a string.' });
        }
        if (!Array.isArray(history)) {
            return res.status(400).json({ error: 'History must be an array.' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Transfer-Encoding', 'chunked');

        const stream = generateChatStream(
            agentConfig, 
            prompt, 
            history as ChatMessage[]
        );

        for await (const chunk of stream) {
            res.write(JSON.stringify(chunk) + '\n');
        }

        res.end();

    } catch (error) {
        console.error('Error in streamChat controller:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process chat stream.' });
        } else {
            // If headers are sent, we can't send a new status code, so just end the response.
            res.end();
        }
    }
};