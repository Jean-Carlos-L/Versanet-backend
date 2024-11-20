import { query } from "../../../common/utils/query.utils.js";

export class ClientRepository {
  static async getTotalClients() {
    return await query("SELECT COUNT(*) AS totalClients FROM clientes");
  }
}
