import express from 'express';
import {crearVenta} from '../controllers/ventas.js';

const router = express.Router();

router.post('/', express.json(), crearVenta);

export default router;