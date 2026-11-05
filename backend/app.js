import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Bienvenido al servidor del Autoservicio');
});

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});