import express from 'express';
import cors from 'cors';
import mainRouter from './routes';

const app = express();

// ============================================
// CORS MIDDLEWARE - ALLOW ALL ORIGINS
// ============================================

// Allow requests from any origin (for development)
// In production, specify exact Vercel domain
const allowedOrigins = [
  'https://frontend-server-test-eipv.vercel.app',  // Your Vercel frontend
  'http://localhost:3000',                          // Local development
  'http://localhost:5173',                          // Vite dev server
  '*'                                               // Allow all for now
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Parse JSON bodies in requests
app.use(express.json());

// Mount the main router under the /api prefix
app.use('/api', mainRouter);

export default app;
