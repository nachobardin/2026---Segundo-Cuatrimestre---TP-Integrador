import express from 'express';
import {crearVenta, descargarTicket} from '../controllers/ventas.js';

const router = express.Router();

router.post('/', express.json(), crearVenta);
router.get('/:id/ticket', descargarTicket);

export default router;