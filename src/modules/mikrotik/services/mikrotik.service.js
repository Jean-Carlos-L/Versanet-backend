import { connection } from "../../../common/config/mikrotik.connection.js";

export class MikrotikService {
  static async getSystemIdentity() {
    try {
      const conn = await connection();
      // Ejecutar el comando para obtener la identidad del sistema
      const identity = await conn.write("/system/identity/print");
      
      console.log("System identity retrieved:", identity);
      
      // Cerrar la conexión
      conn.close();
      
      return identity;
    } catch (error) {
      console.error("Error while trying to get interfaces: ", error);
      throw new Error("Error while trying to get interfaces");
    }
  }

  static async getInterfaceTraffic() {
    try {
      const conn = await connection();
      const traffic = await conn.write('/interface/monitor-traffic', [
        '=interface=ether3',
        '=once='
      ]);
      
      conn.close();
      return traffic;
    } catch (error) {
      console.error("Error while trying to get interface traffic: ", error);
      throw new Error("Error while trying to get interface traffic");
    }
  }

  static async getTrafficByIP() {
    try {
      const conn = await connection();
      
      // Consultar las estadísticas de tráfico de la IP en una simple queue
      const traffic = await conn.write('/queue/simple/print', [
        `?target=172.16.0.4/32`,
        '=stats='
      ]);
      
      conn.close();
      return traffic;
    } catch (error) {
      console.error("Error while trying to get traffic for IP:", error);
      throw new Error("Error while trying to get traffic for IP");
    }
  }

  // Implementar demas métodos para el manejo de la API de Mikrotik
}
