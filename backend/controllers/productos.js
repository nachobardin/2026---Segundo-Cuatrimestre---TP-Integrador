import {unlink} from 'node:fs/promises';
import { Producto } from '../models/producto.js';


// Listar todos los productos activos
export async function listarProductos(req, res) {
    try {
        // Consultamos todos los productos activos en la base de datos
        // los no acrtivos no se muestran pero siguen existiendo en la base de datos
        // los ordenamos por id de menor a mayor
        const productos = await Producto.findAll({
            where: { activo: true},
            order:[['id', 'ASC']]
        });

        // Retornamos los productos en formato JSON
        return res.json(productos);
    } catch (error) {
        return res.status(500).json({
            error: 'No se pudieron consultar los productos'
        });
    }

}


//Mostramos el formulario para cargar un producto nuevo
export function mostrarFormulario(req, res){
    return res.render('producto-form');
    }

    //si el alta falla borramos la imagen que guardo multer
    async function borrarImagen(archivo){
        if(!archivo) return;
        try {
            await unlink(archivo.path);
        } catch (error) {
            console.error('Error al borrar la imagen:', error.message);
        }
    }

    //se validan los datos y se guarda el producto en la base de datos
    export async function crearProducto(req, res, next) {
        const {nombre, categoria, precio} = req.body ?? {};
        const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : '';
        const precioNumero = typeof precio === 'string' ? Number(precio) : NaN;

        if(!nombreLimpio || !categoria || !Number.isFinite(precioNumero) || precioNumero <= 0 || !req.file) {
            await borrarImagen(req.file);
            return res.status(400).send('Ingresa un nombre, una categoria valida, un precio mayor a 0 y una imagen');
    }

    try {
        await Producto.create({
            nombre: nombreLimpio,
            categoria,
            precio: precioNumero,
            imagen: `/uploads/${req.file.filename}`,
            activo: true
        });
    } catch (error) {
        await borrarImagen(req.file);
        return next(error);
    }        

    return res.redirect('/admin');
}