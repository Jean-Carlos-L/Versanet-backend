import { DataTypes } from "sequelize";
import { Database } from "../db/index.js";

const sequelize = Database.getInstance().getConnection();

export const InventoryModel = sequelize.define(
  "Inventory",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    referencia: { type: DataTypes.STRING, allowNull: false },
    direccion_red: { type: DataTypes.STRING, allowNull: false },
    tipo_equipo: { type: DataTypes.ENUM("router", "switch", "mac", "otros") },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
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
    tableName: "inventarios",
    timestamps: true,
  }
);
