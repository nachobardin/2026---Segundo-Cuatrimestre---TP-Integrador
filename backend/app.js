import express from 'express';
import { sequelize } from './db.js';
import './models/producto.js';
import './models/usuario.js';
import rutasProductos from './routes/productos.js';
import rutasUsuarios from './routes/usuarios.js';


const app = express();

app.get('/', (req, res) => {
    res.send('Bienvenido al servidor del Autoservicio');
});

// Conectamos las rutas de productos con la api
app.use('/api/productos', rutasProductos);

// Mostramos la carpeta frontend para poder acceder a los archivos desde el navegador
app.use('/tienda', express.static('../frontend'));

// cpnectamos el alta del administrador con la api
app.use('/api/usuarios', rutasUsuarios);

await sequelize.sync();

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});