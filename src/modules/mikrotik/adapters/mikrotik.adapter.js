import { connection } from "../../../common/config/mikrotik.connection.js";

export class MikrotikAdapter {
  static async getSystemIdentity() {
    const conn = await connection();
    const [response] = await conn.write("/system/identity/print");
    conn.close();
    return response;
  }

  static async getInterfaceTraffic(interfaceName) {
    const conn = await connection();
    const traffic = await conn.write("/interface/monitor-traffic", [
      `=interface=${interfaceName}`,
      "=once=",
    ]);
    conn.close();
    return traffic;
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
