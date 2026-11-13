import {DataTypes} from 'sequelize';
import {sequelize} from '../db.js';
import {Producto} from './producto.js';
import {Venta} from './venta.js';

export const DetalleVenta = sequelize.define('DetalleVenta', {
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precioUnitario: {type: DataTypes.INTEGER, allowNull: false}
}, { timestamps: false });

//una venta puede tener muchos detalles de venta y un producto puede estar en muchos detalles de venta
Venta.belongsToMany(Producto, {
    through: DetalleVenta,
    foreignKey: 'ventaId',
    otherKey: 'productoId'
});

Producto.belongsToMany(Venta, {
    through: DetalleVenta,
    foreignKey: 'productoId',
    otherKey: 'ventaId'
});