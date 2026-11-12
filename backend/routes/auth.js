import express from 'express';
import { mostrarLogin, ingresar, mostrarPanel, salir } from '../controllers/auth.js';
import {requireAuth} from '../middlewares/auth.js'
import { mostrarFormulario, crearProducto, mostrarEdicion, editarProducto, cambiarEstadoProducto } from '../controllers/productos.js';
import { subirImagen } from '../middlewares/productos.js';

const router = express.Router();

//Mostramos el formaulario y recibimos los datos de ingreso
router.get('/login', mostrarLogin);
router.post('/login', ingresar);

// Solo dejamos entar al panel si el administrador inicio sesion
router.get('/admin', requireAuth, mostrarPanel);

router.get('/admin/productos/nuevo', requireAuth, mostrarFormulario);
router.post('/admin/productos', requireAuth, subirImagen, crearProducto);
router.get('/admin/productos/:id/editar', requireAuth, mostrarEdicion);
router.post('/admin/productos/:id/editar', requireAuth, subirImagen, editarProducto);
router.post('/admin/productos/:id/estado', requireAuth, cambiarEstadoProducto);

export default router;

// Recibimos el pedido para cerrar la sesion
router.post('/logout', salir);