import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const Producto = sequelize.define('Producto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    categoria: {
        type: DataTypes.STRING,
        allowNull: false
    },

    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    imagen: {
        type: DataTypes.STRING,
        allowNull: false
    },

    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    timestamps: false 
});