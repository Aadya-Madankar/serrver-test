import express from 'express';
import cors from 'cors';
import mainRouter from './routes';

const app = express();

// ============================================
// CORS MIDDLEWARE - ALLOW ALL ORIGINS
// ============================================

const allowedOrigins = [
  'https://frontend-server-test-eipv.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies in requests
app.use(express.json());

// Mount the main router under the /api prefix
app.use('/api', mainRouter);

export default app;
