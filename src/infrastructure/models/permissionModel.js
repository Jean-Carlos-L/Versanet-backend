import { DataTypes } from "sequelize";
import { Database } from "../db/index.js";

const sequelize = Database.getInstance().getConnection();

export const PermissionModel = sequelize.define(
  "Permission",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    descripcion: { type: DataTypes.STRING, allowNull: false },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "permisos",
    timestamps: true,
  }
);