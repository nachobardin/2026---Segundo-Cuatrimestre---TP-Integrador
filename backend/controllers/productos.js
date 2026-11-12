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
    return res.render('producto-form',{producto : null});
    }

//Buscamos el producto elegido y mostramos sus datos en el formulario
export async function mostrarEdicion(req, res, next){
    try {
        const producto = await Producto.findByPk(req.params.id);

        if(!producto){
            return res.status(400).send('Producto no encontrado');
        }

        return res.render('producto-form', {producto});
    } catch (error) {
        return next(error);
    }
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


//Actualizamos el producto y guardamos su imagen si no se subio otra
export async function editarProducto(req, res, next){
    const { nombre, categoria, precio } = req.body ?? {};
    const nombreLimpio = typeof nombre === 'string' ? nombre.trim(): '';
    const precioNumero = typeof precio === 'string' ? Number(precio) : NaN;


    if(!nombreLimpio || !categoria || !Number.isFinite(precioNumero) || precioNumero <= 0){
        await borrarImagen(req.file);
        return res.status(400).send('Revisa el nombre, la categoria y el precio');
    }

    let imagenAnterior;

    try {
        const producto = await Producto.findByPk(req.params.id);

        if(!producto){
            await borrarImagen(req.file);
            return res.status(400).send('Producto no encontrado');
        }

        imagenAnterior = producto.imagen;

        await producto.update({
            nombre: nombreLimpio,
            categoria,
            precio: precioNumero,
            imagen: req.file ? `/uploads/${req.file.filename}` : imagenAnterior
        });
    } catch (error) {
        await borrarImagen(req.file);
        return next(error);
    }

    // Borramos la foto anterior solo si era una subida nuestra y el cambio ya se guardo
    if (req.file && /^\/uploads\/[a-f0-9-]{36}\.(jpg|png|webp)$/i.test(imagenAnterior ?? '')){
        await borrarImagen({ path: 'public${imagenAnterior}' });
    }

    return res.redirect('/admin');
}