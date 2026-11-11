import express from 'express';
import { sequelize } from './db.js';
import './models/producto.js';
import './models/usuario.js';
import rutasProductos from './routes/productos.js';
import rutasUsuarios from './routes/usuarios.js';
import session from 'express-session';
import rutasAuth from './routes/auth.js'


const app = express();

//Las paginas del administrador van a esatr en la carpte de views
app.set('views', './views');
app.set('view engine', 'ejs');


//Leemos los datos que llegan desde los formularios HTML
app.use(express.urlencoded({ extended: true }));

// Preparamos la sesion para recordar al administreador que inicio sesion
app.use(session({
    secret: process.env.SESSION_SECRET || 'mi_clave_secreta',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
    }
}));


//Dejamos el usuario disponible para las paginas EJS
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    next();
});



app.get('/', (req, res) => {
    res.send('Bienvenido al servidor del Autoservicio');
});

// Conectamos las rutas de productos con la api
app.use('/api/productos', rutasProductos);

// Mostramos la carpeta frontend para poder acceder a los archivos desde el navegador
app.use('/tienda', express.static('../frontend'));

// cpnectamos el alta del administrador con la api
app.use('/api/usuarios', rutasUsuarios);


//Conectamos el ingreso y el panel de administrador
app.use('/', rutasAuth);



await sequelize.sync();

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});