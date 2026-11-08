import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

// gaurdamos el correo y el hash de la contrasenia del admin
export const Usuario = sequelize.define('Usuario', {
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
    timestamps: false
    });
