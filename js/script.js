document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('firmware');
    const fileNameDisplay = document.getElementById('file-name');

    // Adiciona o evento 'change' ao input de arquivo
    fileInput.addEventListener('change', () => {
        // Verifica se algum arquivo foi selecionado
        const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'Nenhum arquivo selecionado';
        // Atualiza o texto do span com o nome do arquivo
        fileNameDisplay.textContent = fileName;
    });
});

function generateCode() {
    const code = Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10); 
    document.getElementById('key').value = code; 
}

// Verifica a query string para mensagens
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
const error = urlParams.get('error');

// Exibe as mensagens de sucesso ou erro, se existirem
const feedbackDiv = document.getElementById('feedback');

if (message) {
    feedbackDiv.innerHTML = `<div class="success">${message}</div>`;
}

if (error) {
    feedbackDiv.innerHTML = `<div class="error">${error}</div>`;
}

// WebSocket
let socket;
let keylog = '';
let mac = '';

document.getElementById('wsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    keylog = document.getElementById('keylog').value;
    mac = document.getElementById('mac').value;

    // Conectando ao WebSocket
    socket = new WebSocket('ws://localhost:8080'); // Modifique conforme a URL do seu WebSocket

    socket.onopen = function() {
        console.log('Conectado ao WebSocket');
        socket.send(JSON.stringify({ key: keylog, mac: mac })); // Envia a key e o mac
    };

    socket.onmessage = function(event) {
        const logMessage = JSON.parse(event.data);
        if (logMessage.key === keylog && logMessage.mac === mac) {
            // Exibe a mensagem se a key e o mac corresponderem
            document.getElementById('logOutput').innerHTML += `<p>${logMessage.message}</p>`;
            document.getElementById('logOutput').scrollTop = document.getElementById('logOutput').scrollHeight;
        }
    };

    socket.onerror = function(error) {
        console.error('Erro WebSocket:', error);
    };

    socket.onclose = function() {
        console.log('Desconectado do WebSocket');
    };
});