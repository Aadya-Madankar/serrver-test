// All imports must be at the very top.
import dotenv from 'dotenv';
import http from 'http';
import type { AddressInfo } from 'net';

// Load environment variables FIRST
dotenv.config();

console.log('🚀 Starting server...');
console.log(`📦 PORT: ${process.env.PORT || 3001}`);
console.log(`🔑 API Key present: ${!!process.env.GEMINI_API_KEY}`);

if (!process.env.GEMINI_API_KEY) {
    console.error("\n❌ FATAL ERROR: GEMINI_API_KEY is not defined.");
    console.error("Please add GEMINI_API_KEY in Railway Variables.\n");
    process.exit(1);
}

// Try to import app - this is where the crash likely happens
let app;
try {
    console.log('📥 Importing app...');
    app = require('./app').default;
    console.log('✅ App imported successfully');
} catch (error) {
    console.error('❌ FATAL ERROR importing app:');
    console.error(error);
    process.exit(1);
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string): number | string | false {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val; // named pipe
    if (port >= 0) return port; // port number
    return false;
}

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

const server = http.createServer(app);

// CRITICAL: Bind to 0.0.0.0 for Railway
console.log(`🌐 Binding to 0.0.0.0:${port}...`);
server.listen(port, '0.0.0.0');

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: Error & { syscall: string; code: string }): void {
    if (error.syscall !== 'listen') throw error;
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
    switch (error.code) {
        case 'EACCES':
            console.error(`❌ ${bind} requires elevated privileges`);
            process.exit(1);
        case 'EADDRINUSE':
            console.error(`❌ ${bind} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
    const addr = server.address();
    if (!addr) {
        console.error('❌ Server address not available');
        return;
    }
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${(addr as AddressInfo).port}`;
    console.info(`✅ Server listening on ${bind}`);
    console.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

server.on('error', onError);
server.on('listening', onListening);

// Catch any unhandled errors
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:');
    console.error(error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
    process.exit(1);
});
