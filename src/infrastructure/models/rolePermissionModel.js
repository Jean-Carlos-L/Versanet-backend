// models/rolPermiso.js
import { DataTypes } from 'sequelize';
import { Database } from '../db/index.js';

const sequelize = Database.getInstance().getConnection();

export const RolePermissionModel = sequelize.define(
  'RolePermission',
  {
    id: {
      type: DataTypes.CHAR(50),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    rol_id: { type: DataTypes.CHAR(50), allowNull: false },
    permiso_id: { type: DataTypes.CHAR(50), allowNull: false },
    fecha_creacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'roles_permisos',
    timestamps: false,
  }
);