import express from 'express';
import { listarProductos } from '../controllers/productos.js';

const router = express.Router();

// Cuando se pide la lista, llamamos a la funcion del controlador
router.get('/', listarProductos);

export default router;