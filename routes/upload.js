const express = require('express');
const path = require('path');
const multer = require('multer');
const { deleteFirmwareFile } = require('../services/fileUtils');

const router = express.Router();
const uploadDir = path.join(__dirname, '../firmware');

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        deleteFirmwareFile(uploadDir);
        const version = req.body.version;
        const key = req.body.key;
        const newFileName = `firmware_key.${key}_version_${version}.bin`;
        cb(null, newFileName);
    }
});

const upload = multer({ storage });

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Rota para upload
router.post('/', upload.single('firmware'), (req, res) => {
    const version = req.body.version;
    const apiKey = req.body.key;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!version || !apiKey || !req.file) {
        return res.redirect('/?error=Todos os campos são obrigatórios.');
    }

    // Redireciona com mensagem de sucesso
    res.redirect(`/?message=Arquivo firmware_${version}.bin enviado com sucesso!`);
});

module.exports = router;
