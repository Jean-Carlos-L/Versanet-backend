import { DataTypes } from "sequelize";
import { Database } from "../db/index.js";

const sequelize = Database.getInstance().getConnection();

export const ActivityLogModel = sequelize.define(
  "ActivityLog",
  {
    id: {
      type: DataTypes.CHAR,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    actor_id: { type: DataTypes.CHAR, allowNull: true },
    actor_name: { type: DataTypes.STRING, allowNull: true },
    action: { type: DataTypes.STRING, allowNull: false },
    entity: { type: DataTypes.STRING, allowNull: false },
    entity_id: { type: DataTypes.CHAR, allowNull: true },
    details: { type: DataTypes.TEXT, allowNull: true },
    metadata: { type: DataTypes.JSON, allowNull: true },
  },
  {
    tableName: "activity_logs",
    timestamps: true,
  }
);
