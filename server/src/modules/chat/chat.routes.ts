// FIX: Use default import for Express to ensure proper type resolution.
import express from 'express';
import { streamChat } from './chat.controller';

// FIX: Added { mergeParams: true } to allow this router to access params from parent routers (e.g., :agentName).
const router = express.Router({ mergeParams: true });

router.post('/stream', streamChat);

export default router;