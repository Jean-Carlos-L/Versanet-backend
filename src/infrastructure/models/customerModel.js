import { DataTypes } from "sequelize";
import { Database } from "../db/index.js";

const sequelize = Database.getInstance().getConnection();

export const CustomerModel = sequelize.define(
  "Customer",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nombres: { type: DataTypes.STRING, allowNull: false },
    cedula: { type: DataTypes.STRING, allowNull: false, unique: true },
    correo_electronico: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    telefono: { type: DataTypes.STRING, allowNull: true },
    direccion: { type: DataTypes.STRING, allowNull: true },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "activo",
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "clientes",
    timestamps: true,
  }
);