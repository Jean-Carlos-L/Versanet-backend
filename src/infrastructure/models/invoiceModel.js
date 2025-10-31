import { DataTypes } from "sequelize";
import { Database } from "../db/index.js";

const sequelize = Database.getInstance().getConnection();

export const InvoiceModel = sequelize.define(
  "Invoice",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    cliente_id: { type: DataTypes.CHAR, allowNull: false },
    contrato_id: { type: DataTypes.CHAR, allowNull: false },
    fecha_facturacion: { type: DataTypes.DATE, allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
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
    tableName: "facturas",
    timestamps: true,
  }
);
