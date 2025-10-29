// FIX: Added the main express import to enable module augmentation for Request and Response types.
import express from 'express';

// FIX: Use regular import for Express types to ensure proper type resolution.
// FIX: Changed `import type` to a regular `import` for Express types. This ensures Request and Response objects have the correct, extended Express types, fixing errors related to missing properties like `.params` and `.status`.
import { Request, Response } from 'express';
import { agentRegistry } from '../../agents/agent.registry';

export const getLiveConfig = (req: Request, res: Response) => {
  try {
    const { agentName } = req.params;
    const agentConfig = agentRegistry.get(agentName);

    if (!agentConfig) {
      return res.status(404).json({ error: `Agent "${agentName}" live config not found.` });
    }

    // Return only the necessary live configuration to the client
    res.status(200).json(agentConfig.live);
  } catch (error) {
    console.error('Error fetching live config:', error);
    res.status(500).json({ error: 'Failed to fetch live configuration.' });
  }
};

// NEW: API key endpoint for voice calling
export const getApiKey = (req: Request, res: Response) => {
  try {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured on server.' });
    }

    res.status(200).json({ apiKey });
  } catch (error) {
    console.error('Error fetching API key:', error);
    res.status(500).json({ error: 'Failed to fetch API key.' });
  }
};
