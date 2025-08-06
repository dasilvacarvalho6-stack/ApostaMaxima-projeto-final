const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// GET jogos
app.get('/api/jogos', (req, res) => {
    fs.readFile('./db/jogos.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Erro ao carregar jogos');
        res.json(JSON.parse(data));
    });
});

// POST aposta
app.post('/api/apostar', (req, res) => {
    const aposta = req.body;
    fs.readFile('./db/apostas.json', 'utf8', (err, data) => {
        let apostas = [];
        if (!err) apostas = JSON.parse(data);
        apostas.push(aposta);
        fs.writeFile('./db/apostas.json', JSON.stringify(apostas, null, 2), err => {
            if (err) return res.status(500).send('Erro ao salvar aposta');
            res.status(200).send({ status: 'Aposta registrada com sucesso' });
        });
    });
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));