import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const Venta = sequelize.define('Venta', {
    nombreCliente: { type: DataTypes.STRING, allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    total: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: false });