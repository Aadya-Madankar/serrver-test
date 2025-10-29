// FIX: Use default import for Express to ensure proper type resolution.
import express from 'express';
import { getLiveConfig, getApiKey } from './live.controller';

// FIX: Added { mergeParams: true } to allow this router to access params from parent routers (e.g., :agentName).
const router = express.Router({ mergeParams: true });

// This route provides the config for the default low-latency, client-side connection.
router.get('/config', getLiveConfig);

// NEW: API key endpoint for voice calling
router.get('/key', getApiKey);

export default router;
