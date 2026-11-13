import { sequelize } from '../db.js';
import { Producto } from '../models/producto.js';
import { Venta } from '../models/venta.js';
import { DetalleVenta } from '../models/detalle-venta.js';

export async function crearVenta(req, res) {
    const { nombreCliente, productos } = req.body ?? {};
    const nombre = typeof nombreCliente === 'string' ? nombreCliente.trim() : '';

    if (!nombre || !Array.isArray(productos) || !productos.length) {
        return res.status(400).json({ error: 'Tenes que ingresar tu nombre y agregar productos.' });
    }

    const ids = new Set();

    for (const item of productos) {
        if (!Number.isSafeInteger(item?.id) || item.id < 1 ||
            !Number.isSafeInteger(item.cantidad) || item.cantidad < 1 ||
            ids.has(item.id)) {
            return res.status(400).json({ error: 'Volve a revisar los productos y las cantidades.' });
        }

        ids.add(item.id);
    }

    try {
        //guardamos la venta con sus detalles. si falla algo se borra todo
        const venta = await sequelize.transaction(async function (transaction) {
            const detalles = [];
            let totalCentavos = 0;

            for (const item of productos) {
                const producto = await Producto.findOne({
                    where: { id: item.id, activo: true },
                    transaction
                });

                if (!producto) return null;

                const precioUnitarioCentavos = Math.round(producto.precio * 100);
                totalCentavos += precioUnitarioCentavos * item.cantidad;

                if (!Number.isSafeInteger(totalCentavos)) return null;

                detalles.push({
                    productoId: producto.id,
                    cantidad: item.cantidad,
                    precioUnitario: precioUnitarioCentavos
                });
            }

            const ventaNueva = await Venta.create(
                { nombreCliente: nombre, total: totalCentavos },
                { transaction }
            );

            await DetalleVenta.bulkCreate(
                detalles.map(function (detalle) {
                    return { ...detalle, ventaId: ventaNueva.id };
                }),
                { transaction }
            );

            return ventaNueva;
        });

        if (!venta) {
            return res.status(400).json({
                error: 'Hay productos que ya no están disponibles o cantidades fuera de rango.'
            });
        }

        return res.status(201).json({ id: venta.id, totalCentavos: venta.total });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'No se pudo guardar la compra.' });
    }
}

