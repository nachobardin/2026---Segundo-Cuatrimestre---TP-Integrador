import express from 'express';
import { crearAdministrador } from '../controllers/usuarios.js';

const router = express.Router();

// solo permitimos el alta si se configuro la clave de alta en el archivo .env y si se envia en la cabecera x-clave-alta
function requiereClaveAlta(req, res, next) {
    const claveAlta = process.env.CLAVE_ALTA_ADMIN;

    if (!claveAlta || req.get('x-clave-alta') !== claveAlta) {
        return res.status(403).json({ error: 'Alta de administrador no autorizada' });
    }

    next();
}

// revisamos los datos antes de pasarselos al controlador
function validarAlta(req, res, next) {
    const { correo, password } = req.body || {};

    if (typeof correo !== 'string' || !correo.trim().includes('@') ||
        typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({
            error: 'Ingresa un correo y una contraseña de al menos 8 caracteres'
        });
    }

    // quitamos los espacios y usamos minusculas para guardar siempre el mismo correo
    req.body.correo = correo.trim().toLowerCase();
    next();
}

router.post('/', requiereClaveAlta, express.json(), validarAlta, crearAdministrador);

// si el JSON esta mal escrito devolvemos el error tambieen en JSON
router.use((error, req, res, next) => {
    return res.status(error.status || 500).json({
        error: 'No se pudo realizar el alta'
    });
});

export default router;