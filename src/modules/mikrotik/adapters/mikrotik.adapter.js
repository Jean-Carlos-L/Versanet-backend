import { connection } from "../../../common/config/mikrotik.connection.js";

export class MikrotikAdapter {
  static async getSystemIdentity() {
    const conn = await connection();
    const [response] = await conn.write("/system/identity/print");
    conn.close();
    return response;
  }

  static async getInterfaceTraffic(interfaceName) {
    try {
      const conn = await connection();
  
      // Llamada a la API de MikroTik
      const traffic = await conn.write("/interface/monitor-traffic", [
        `=interface=${interfaceName}`,
        "=once",
      ]);
  
      conn.close();
  
      // Convertimos los datos de strings a números
      if (traffic.length > 0) {
        return {
          name: traffic[0]["name"],
          rxPacketsPerSecond: Number(traffic[0]["rx-packets-per-second"]),
          rxBitsPerSecond: Number(traffic[0]["rx-bits-per-second"]),
          txPacketsPerSecond: Number(traffic[0]["tx-packets-per-second"]),
          txBitsPerSecond: Number(traffic[0]["tx-bits-per-second"]),
        };
      } else {
        throw new Error("No data returned for the specified interface");
      }
    } catch (error) {
      console.error("Error while retrieving interface traffic:", error);
      throw new Error("Failed to retrieve interface traffic");
    }
  }
  

  static async getTrafficByIP(ip) {
    const conn = await connection();
    const traffic = await conn.write("/queue/simple/print", [
      `?target=${ip}/32`,
      "=stats=",
    ]);
    conn.close();
    return traffic;
  }
}
