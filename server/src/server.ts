import dotenv from 'dotenv';
import http from 'http';
import type { AddressInfo } from 'net';

dotenv.config();

console.log('🚀 Starting server...');
console.log(`📦 PORT: ${process.env.PORT || 3001}`);
console.log(`🔑 API Key present: ${!!process.env.GEMINI_API_KEY}`);

if (!process.env.GEMINI_API_KEY) {
    console.error("\n❌ FATAL ERROR: GEMINI_API_KEY is not defined.");
    process.exit(1);
}

let app: any;
try {
    app = require('./app').default;
    console.log('✅ App imported successfully');
} catch (error) {
    console.error('❌ FATAL ERROR importing app:', error);
    process.exit(1);
}

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`✅ Server listening on port ${port}`);
});

server.on('error', (error: any) => {
    if (error.syscall !== 'listen') throw error;
    if (error.code === 'EACCES') {
        console.error(`Port ${port} requires elevated privileges`);
        process.exit(1);
    }
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
        process.exit(1);
    }
    throw error;
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:', reason);
    process.exit(1);
});
