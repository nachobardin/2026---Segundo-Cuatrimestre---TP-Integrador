import bcrypt from 'bcrypt';
import { Usuario } from '../models/usuario.js';
import { Producto } from '../models/producto.js';

// Mostramos el formulario de ingreso sin ningún mensaje de error
export function mostrarLogin(req, res) {
    return res.render('login', { error: null });
}

// Revisamos los datos enviados desde el formulario
export async function ingresar(req, res, next) {
    try {
        const correo = typeof req.body.correo === 'string'
            ? req.body.correo.trim().toLowerCase()
            : '';

        const password = typeof req.body.password === 'string'
            ? req.body.password
            : '';

        // Buscamos en la base al usuario que tiene ese correo
        const usuario = await Usuario.findOne({
            where: { correo }
        });

        // Si encontramos al usuario, comprobamos su contraseña con bcrypt
        const credencialesValidas = usuario
            ? await bcrypt.compare(password, usuario.passwordHash)
            : false;

        if (!credencialesValidas) {
            return res.status(401).render('login', {
                error: 'Correo o contraseña incorrectos'
            });
        }

        // Renovamos la sesión antes de guardar al usuario que ingresó
        req.session.regenerate((error) => {
            if (error) return next(error);

            req.session.usuario = {
                id: usuario.id,
                correo: usuario.correo
            };

            // Esperamos a que la sesión quede guardada para abrir el panel
            req.session.save((error) => {
                if (error) return next(error);

                return res.redirect('/admin');
            });
        });
    } catch (error) {
        next(error);
    }
}


//Mostramos todos los prodcutos en el panel de administracion ordenados por id ascendente
export async function mostrarPanel(req, res) {
    const productos = await Producto.findAll({
        order: [['id', 'ASC']]
    });
    //pasamos la lista a la vista para que la muestre
    return res.render('admin', { productos });
}


// Borramos la sesion del administrador y velovemos al login

export function salir(req, res, next){
    req.session.destroy((error) => {
        if(error) return next(error);

        res.clearCookie('connect.sid');
        return res.redirect('/login');
    });
}