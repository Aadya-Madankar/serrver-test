import express from 'express';
import cors from 'cors';
import mainRouter from './routes';

const app = express();

// Allow requests from the frontend development server
app.use(cors()); 

// Parse JSON bodies in requests
app.use(express.json());

// Mount the main router under the /api prefix
app.use('/api', mainRouter);

export default app;
