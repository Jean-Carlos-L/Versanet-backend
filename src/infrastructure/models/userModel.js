import { DataTypes } from "sequelize";
import { Database } from "../db/index.js";

const sequelize = Database.getInstance().getConnection();

export const UserModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nombres: { type: DataTypes.STRING, allowNull: false },
    correo_electronico: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contrasena: { type: DataTypes.STRING, allowNull: false },
    rol_id: { type: DataTypes.CHAR, allowNull: false },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "activo",
    },
    codigo_recuperacion: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
  }
);
