const express = require('express');
const { networkInterfaces } = require('os');
const path = require('path');
const WebSocket = require('ws');

const firmwareRoutes = require('./routes/firmware');
const uploadRoutes = require('./routes/upload');
const logMonitor = require('./routes/log_monitor');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rotas
app.use('/firmware', firmwareRoutes);
app.use('/upload', uploadRoutes);
app.use('/logmonitor', logMonitor);

// Mostrar IPs locais
const server = app.listen(PORT, () => {
    const nets = networkInterfaces();
    const results = {};
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    console.log(`Listening on port ${PORT}\n`, results);


    const wss = new WebSocket.Server({ server });

    // Chama o método para gerenciar WebSocket dentro do módulo log_monitor
    logMonitor.ws(wss);
});



