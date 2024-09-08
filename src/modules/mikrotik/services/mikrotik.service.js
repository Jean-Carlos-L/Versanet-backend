import { connection } from "../../../common/config/mikrotik.connection.js";

export class MikrotikService {
  static async getInterfaces() {
    try {
      const conn = await connection;
      const interfaces = await conn.write("/interface/print");
      return interfaces;
    } catch (error) {
      console.error("Error while trying to get interfaces: ", error);
      throw new Error("Error while trying to get interfaces");
    }
  }

  // Implementar demas métodos para el manejo de la API de Mikrotik
}
