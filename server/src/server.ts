
// All imports must be at the very top.
import dotenv from 'dotenv';
import http from 'http';
import app from './app';
import type { AddressInfo } from 'net';

// Execute code only after all modules are imported.
dotenv.config(); // Load environment variables from .env file

if (!process.env.GEMINI_API_KEY) {
    console.error("\nFATAL ERROR: GEMINI_API_KEY is not defined.");
    console.error("Please create a .env file in the /server directory and add your API key.");
    console.error("Example: GEMINI_API_KEY=your_google_api_key_here\n");
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

server.listen(port, '0.0.0.0');

/**
 * Event listener for HTTP server "error" event.
 */
// FIX: Replaced 'NodeJS.ErrnoException' with a compatible intersection type to remove dependency on the 'NodeJS' namespace.
function onError(error: Error & { syscall: string; code: string }): void {
    if (error.syscall !== 'listen') throw error;
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
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
        console.error('Server address not available');
        return;
    }
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${(addr as AddressInfo).port}`;
    console.info(`Listening on ${bind}`);
}

server.on('error', onError);
server.on('listening', onListening);
