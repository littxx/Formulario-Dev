const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Diretório temporário para arquivos

// Middleware para servir arquivos estáticos (HTML e outros)
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', upload.single('file'), async (req, res) => {
    const { name, email, phone, resume } = req.body;
    const resumeFile = req.file;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'seu_email@gmail.com',
            pass: 'sua_senha'
        }
    });

    try {
        await transporter.sendMail({
            from: '"Candidatura" <seu_email@gmail.com>',
            to: 'destinatario@gmail.com',
            subject: 'Nova Candidatura Recebida',
            text: `Nome: ${name}\nEmail: ${email}\nTelefone: ${phone}\nExperiência: ${resume}`,
            attachments: [
                {
                    filename: resumeFile.originalname,
                    path: resumeFile.path
                }
            ]
        });

        fs.unlinkSync(resumeFile.path); // Remove o arquivo temporário
        res.status(200).send('Candidatura enviada com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        res.status(500).send('Erro ao enviar a candidatura.');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
