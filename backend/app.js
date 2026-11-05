import express from 'express';
import { sequelize } from './db.js';
import './models/producto.js';


const app = express();

app.get('/', (req, res) => {
    res.send('Bienvenido al servidor del Autoservicio');
});

await sequelize.sync();

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});