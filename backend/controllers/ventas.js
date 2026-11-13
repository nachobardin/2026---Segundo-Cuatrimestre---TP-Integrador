import { sequelize } from '../db.js';
import { Producto } from '../models/producto.js';
import { Venta } from '../models/venta.js';
import { DetalleVenta } from '../models/detalle-venta.js';
import PDFDocument from 'pdfkit';

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


        //Dejamos disponible el ticket de la compra que acaba de hacer este navegador.
        req.session.ultimaVentaId = venta.id;


        return res.status(201).json({ id: venta.id, totalCentavos: venta.total });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'No se pudo guardar la compra.' });
    }

}




export async function descargarTicket(req, res, next){

    try{
        const id = Number(req.params.id);


        if(!Number.isSafeInteger(id) || id < 1 || req.session.ultimaVentaId !== id){
            return res.status(404).send('Ticket no disponible');
        }

        const venta = await Venta.findByPk(id);
        if(!venta) return res.status(400).send('Ticket no disponible');

        const detalles = await DetalleVenta.findAll({where: {ventaId: id}});
        const moneda = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        });


        const fecha = new Date(venta.fecha).toLocaleString('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires'
        });

        //Buscamos el nombre del producto, pero usamos el precio guardado en la venta.
        const lineas = [];
        for (const detalle of detalles){
            const producto = await Producto.findByPk(detalle.productoId);
            const nombre = producto?.nombre ?? 'Producto #' + detalle.productoId;
            const unitario = moneda.format(detalle.precioUnitario / 100);
            const subtotal = moneda.format(detalle.precioUnitario * detalle.cantidad / 100);

            lineas.push(`${nombre} | ${detalle.cantidad} x ${unitario} = ${subtotal}`);

        }

        const doc = new PDFDocument({margin: 40});
        res.attachment(`ticket-${venta.id}.pdf`);
        res.set('Cache-Control', 'no-store');
        doc.pipe(res);


        doc.fontSize(20).text('Autoservicio NBA');
        doc.fontSize(12).text(`Ticket #${venta.id}`);
        doc.text(`Cliente: ${venta.nombreCliente}`);
        doc.text(`Fecha: ${fecha}`);
        doc.moveDown();


        for (const linea of lineas){
            doc.text(linea);
        }

        doc.moveDown();
        doc.fontSize(14).text(`Total: ${moneda.format(venta.total / 100)}`);
        doc.end();

    } catch (error){
        next(error);
    }

} 