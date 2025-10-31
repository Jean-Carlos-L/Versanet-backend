import { DataTypes } from "sequelize";
import { Database } from "../db/index.js";

const sequelize = Database.getInstance().getConnection();

export const PaymentModel = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    factura_id: { type: DataTypes.CHAR, allowNull: false },
    fecha_pago: { type: DataTypes.DATE, allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    metodo_pago: {
      type: DataTypes.ENUM(
        "tarjeta_credito",
        "tarjeta_debito",
        "transferencia_bancaria",
        "efectivo",
        "otros"
      ),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("completado", "pendiente", "fallido"),
      allowNull: false,
      defaultValue: "pendiente",
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "pagos",
    timestamps: true,
  }
);
