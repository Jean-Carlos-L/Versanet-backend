import { MikrotikRepository } from "../repositories/mikrotik.repository.js";

export class MikrotikService {
  static async getSystemIdentity() {
    return await MikrotikRepository.fetchSystemIdentity();
  }

  static async getInterfaceTraffic(interfaceName = "ether3") {
    return await MikrotikRepository.fetchInterfaceTraffic(interfaceName);
  }

  static async getTrafficByIP(ip) {
    return await MikrotikRepository.fetchTrafficByIP(ip);
  }
}
