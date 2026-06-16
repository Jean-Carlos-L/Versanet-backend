import { Sequelize } from "sequelize";
import {
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USER,
} from "../constants/mysqlConstants.js";

export class Database {
  static instance = null;

  constructor() {
    if (Database.instance) {
      throw new Error(
        "Error: Instantiation failed: Use Database.getInstance() instead of new."
      );
    }

    this.sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
      host: MYSQL_HOST,
      dialect: "mysql",
      port: MYSQL_PORT,
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }

  async syncModels() {
    try {
      await this.sequelize.sync({ force: true });
      console.log("🟢 All models were synchronized successfully.");
    } catch (error) {
      console.error("🔴 Error synchronizing models:", error.message);
      throw error;
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      console.log("🟢 MySQL connection established successfully.");
      //await this.syncModels();
    } catch (error) {
      console.error("🔴 Unable to connect to MySQL:", error.message);
      throw error;
    }
  }

  getConnection() {
    return this.sequelize;
  }
}
