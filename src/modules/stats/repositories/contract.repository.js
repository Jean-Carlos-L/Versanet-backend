import { query } from "../../../common/utils/query.utils.js";

export class ContractRepository {
  static async getTotalContracts() {
    return await query(
      "SELECT COUNT(*) as total FROM clientes_planes"
    );
  }

  static async getActiveContracts() {
    return await query(
      "SELECT COUNT(*) as active FROM clientes_planes WHERE estado = 1"
    );
  }

  static async getInactiveContracts() {
    return await query(
      "SELECT COUNT(*) AS inactiveContracts FROM clientes_planes WHERE Estado = 0"
    );
  }

  static async getClientsByPlanSpeed(speed) {
    return await query(
      `SELECT COUNT(*) AS clientsWith${speed}MPlan FROM clientes_planes AS cp JOIN planes AS p ON cp.idPlan = p.id WHERE p.descripcion LIKE CONCAT('%',${speed},' M%')`,
      [speed]
    );
  }
}
