const fs = require('fs');
const path = require('path');

function deleteFirmwareFile(uploadDir) {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Erro ao ler o diretório de firmware:', err);
            return;
        }

        files.forEach(file => {
            if (file.startsWith('firmware_')) {
                const filePath = path.join(uploadDir, file);
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Erro ao apagar o arquivo:', unlinkErr);
                    } else {
                        console.log(`Arquivo ${file} deletado com sucesso.`);
                    }
                });
            }
        });
    });
}

module.exports = { deleteFirmwareFile };
