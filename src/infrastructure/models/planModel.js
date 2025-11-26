import { DataTypes } from "sequelize";
import { Database } from "../db/index.js";

const sequelize = Database.getInstance().getConnection();

export const PlanModel = sequelize.define(
  "Plan",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    descripcion: { type: DataTypes.STRING, allowNull: false },
    caracteristicas: { type: DataTypes.TEXT, allowNull: false },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    duracion: { type: DataTypes.INTEGER, allowNull: false },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "planes",
    timestamps: true,
  }
);
