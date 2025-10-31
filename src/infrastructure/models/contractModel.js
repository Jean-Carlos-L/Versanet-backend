import { DataTypes } from "sequelize";
import { Database } from "../db/index.js";

const sequelize = Database.getInstance().getConnection();

export const ContractModel = sequelize.define(
  "Contract",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    cliente_id: { type: DataTypes.CHAR, allowNull: false },
    plan_id: { type: DataTypes.CHAR, allowNull: false },
    fecha_inicio: { type: DataTypes.DATE, allowNull: false },
    fecha_fin: { type: DataTypes.DATE, allowNull: false },
    equipo_id: { type: DataTypes.CHAR, allowNull: true },
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
    tableName: "contratos",
    timestamps: true,
  }
);
