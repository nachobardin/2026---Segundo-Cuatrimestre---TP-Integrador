import express from 'express';
import { mostrarLogin, ingresar, mostrarPanel, salir } from '../controllers/auth.js';
import {requireAuth} from '../middlewares/auth.js'

const router = express.Router();

//Mostramos el formaulario y recibimos los datos de ingreso
router.get('/login', mostrarLogin);
router.post('/login', ingresar);

// Solo dejamos entar al panel si el administrador inicio sesion
router.get('/admin', requireAuth, mostrarPanel);

export default router;

// Recibimos el pedido para cerrar la sesion
router.post('/logout', salir);