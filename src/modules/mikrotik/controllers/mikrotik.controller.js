import { MikrotikService } from "../services/mikrotik.service.js";

export class MikrotikController {
  static async getSystemIdentity(req, res) {
    try {
      const identity = await MikrotikService.getSystemIdentity();
      res.json(identity);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve system identity" });
    }
  }

  static async getInterfaceTraffic(req, res) {
    try {
      const traffic = await MikrotikService.getInterfaceTraffic(req.query.interface);
      res.json(traffic);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve interface traffic" });
    }
  }

  static async getTrafficByIP(req, res) {
    try {
      const traffic = await MikrotikService.getTrafficByIP(req.query.ip);
      res.json(traffic);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve traffic by IP" });
    }
  }
}
