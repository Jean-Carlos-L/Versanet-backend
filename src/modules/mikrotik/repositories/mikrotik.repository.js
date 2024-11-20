import { MikrotikAdapter } from "../adapters/mikrotik.adapter.js";

export class MikrotikRepository {
  static async fetchSystemIdentity() {
    return await MikrotikAdapter.getSystemIdentity();
  }

  static async fetchInterfaceTraffic(interfaceName) {
    return await MikrotikAdapter.getInterfaceTraffic(interfaceName);
  }

  static async fetchTrafficByIP(ip) {
    return await MikrotikAdapter.getTrafficByIP(ip);
  }
}
