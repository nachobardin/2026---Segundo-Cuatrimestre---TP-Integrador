import bcrypt from 'bcrypt';
import { Usuario } from '../models/usuario.js';

// se crea el usuario administrador
export async function crearAdministrador(req, res) {
    try {
        const { correo, password } = req.body;

        // revisamos si ya existe un usuario con ese correo
        const usuarioExistente = await Usuario.findOne({
            where: { correo }
        });

        if (usuarioExistente) {
            return res.status(409).json({
                error: 'Ya existe un usuario con ese correo'
            });
        }

        // Guardamos el hash que genera bcrypt en lugar de la contraseña
        const passwordHash = await bcrypt.hash(password, 12);
        const usuario = await Usuario.create({ correo, passwordHash });

        // devolvemos los datos del usuario sin el hash
        return res.status(201).json({
            id: usuario.id,
            correo: usuario.correo
        });
    } catch (error) {
        return res.status(500).json({
            error: 'No se pudo crear el administrador'
        });
    }
}