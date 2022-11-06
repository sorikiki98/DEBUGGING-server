import { startServer } from "./app.js";
import { config } from './config.js';

let server;
try {
    server = startServer(config.host.port);
} catch(error) {
    console.log('Cannot start server...');
}