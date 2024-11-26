const express = require('express');
const fs = require('fs');
const path = require('path');
const { deleteFirmwareFile } = require('../services/fileUtils');

const router = express.Router();
const uploadDir = path.join(__dirname, '../firmware');

router.get('/:version', (req, res) => {
    const oldVersion = req.params.version;
    const apiKey = req.query.key;
    const files = fs.readdirSync(uploadDir);

    const firmwareFiles = files.filter(file => 
        file.startsWith(`firmware_key.${apiKey}_version_`) && file.endsWith('.bin')
    );

    if (firmwareFiles.length === 0) {
        return res.status(404).send('Nenhum firmware encontrado.');
    }

    let latestVersion = '';
    let filePath = '';

    firmwareFiles.forEach(file => {
        const versionMatch = file.match(new RegExp(`firmware_key\\.${apiKey}_version_(.+)\\.bin`));
        if (versionMatch) {
            const version = versionMatch[1];
            if (version > latestVersion) {
                latestVersion = version;
                filePath = path.join(uploadDir, file);
            }
        }
    });

    if (latestVersion === oldVersion) {
        return res.status(304).send('Firmware já está atualizado.');
    }

    if (filePath) {
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
        return res.sendFile(filePath);
    } else {
        return res.status(404).send('Firmware não encontrado.');
    }
});

module.exports = router;
