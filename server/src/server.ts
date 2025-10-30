import dotenv from 'dotenv';
import http from 'http';
import type { AddressInfo } from 'net';

dotenv.config();

console.log('🚀 Starting server...');
console.log(`📦 PORT: ${process.env.PORT || 3001}`);
console.log(`🔑 API Key present: ${!!process.env.GEMINI_API_KEY}`);

if (!process.env.GEMINI_API_KEY) {
    console.error("\n❌ FATAL ERROR: GEMINI_API_KEY is not defined.");
    console.error("Please add GEMINI_API_KEY in Railway Variables.\n");
    process.exit(1);
}

let app: any;
try {
    console.log('📥 Importing app...');
    app = require('./app').default;
    console.log('✅ App imported successfully');
} catch (error) {
    console.error('❌ FATAL ERROR importing app:');
    console.error(error);
    process.exit(1);
}

function normalizePort(val: string): number | string | false {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

const server = http.createServer(app);

server.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server listening on port ${port}`);
});

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

function onListening(): void {
    const addr = server.address();
    if (!addr) {
        console.error('❌ Server address not available');
        return;
    }
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${(addr as AddressInfo).port}`;
    console.info(`✅ Server listening on ${bind}`);
}

server.on('error', onError);
server.on('listening', onListening);

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:');
    console.error(error);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:');
    console.error(reason);
    process.exit(1);
});
