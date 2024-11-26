const express = require('express');
const path = require('path');
const router = express.Router();
const WebSocket = require('ws');

// Rota para servir a página HTML de monitoramento de logs
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')); // Serve a página HTML de logs
});

// Função que gerencia a conexão WebSocket e envia logs em tempo real
router.ws = (wss) => {
    wss.on('connection', (ws) => {
        console.log('Novo cliente conectado para monitoramento de log.');

        let clientKey = null;
        let clientMac = null;

        // Quando o cliente envia dados (key + mac)
        ws.on('message', (data) => {
            const message = JSON.parse(data);
            if (message.key && message.mac) {
                clientKey = message.key;
                clientMac = message.mac;
                console.log(`Cliente conectado com API Key: ${clientKey} e MAC: ${clientMac}`);
            } else {
                console.log('Erro: key ou mac não fornecidos corretamente.');
            }
        });

        // Simulação de envio de logs em tempo real
        setInterval(() => {
            // Simula um log com key e mac que podem ser enviados
            const logData = {
                key: 'API_KEY_EXEMPLO', // Troque por lógica real
                mac: '00:14:22:01:23:45', // Troque por lógica real
                message: `Novo log recebido às ${new Date().toISOString()}`
            };

            // Verifica se o log corresponde à key e mac do cliente
            if (logData.key === clientKey && logData.mac === clientMac) {
                ws.send(JSON.stringify(logData)); // Envia o log para o cliente se corresponder
            }
        }, 1000); // Envia um log a cada 1 segundo

        ws.on('close', () => {
            console.log('Cliente desconectado.');
        });
    });
};

module.exports = router;
