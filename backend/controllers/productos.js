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