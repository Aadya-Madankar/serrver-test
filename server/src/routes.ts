// FIX: Use default import for express and regular imports for types to ensure proper type resolution.
import express from 'express';

// FIX: Changed from `import type` to a regular `import`. This is necessary for Express types to be correctly resolved with all their properties (like `.json`, `.status`, etc.), fixing multiple type errors in this file and dependent files.
import { Request, Response, NextFunction } from 'express';

import { agentRegistry } from './agents/agent.registry';
import chatRoutes from './modules/chat/chat.routes';
import liveRoutes from './modules/live/live.routes';

const router = express.Router();

// Middleware to check if the requested agent exists
const agentCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const agentName = req.params.agentName;
  if (!agentRegistry.has(agentName)) {
    return res.status(404).json({ error: `Agent "${agentName}" not found.` });
  }
  next();
};

// ============================================
// HEALTH CHECK & API KEY ENDPOINTS
// ============================================

// A simple health-check endpoint
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server is UP' });
});

// Return API key to frontend
router.get('/key', (req: Request, res: Response) => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (apiKey) {
    res.json({ apiKey });
  } else {
    res.status(500).json({ error: 'API_KEY is not configured on the server.' });
  }
});

// ============================================
// AGENT DISCOVERY ENDPOINTS (ONLY 2 NEW ONES NEEDED!)
// ============================================

// Get all available agents
router.get('/agents', (req: Request, res: Response) => {
  try {
    const agents = Array.from(agentRegistry.keys()).map(name => ({
      name,
      displayName: agentRegistry.get(name)?.name || name
    }));
    res.json({ agents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Get specific agent config
router.get('/agents/:agentName/config', (req: Request, res: Response) => {
  try {
    const { agentName } = req.params;
    const agentConfig = agentRegistry.get(agentName);
    
    if (!agentConfig) {
      return res.status(404).json({ error: `Agent "${agentName}" not found.` });
    }
    
    res.json(agentConfig);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent config' });
  }
});

// ============================================
// AGENT-SPECIFIC ROUTES
// ============================================

// Group agent-specific routes
// FIX: Added { mergeParams: true } to ensure child routers can access parent route params (like :agentName)
const agentRouter = express.Router({ mergeParams: true });

agentRouter.use('/chat', chatRoutes);
agentRouter.use('/live', liveRoutes);

// Mount the agent router with the agent check middleware
router.use('/agents/:agentName', agentCheckMiddleware, agentRouter);

export default router;
