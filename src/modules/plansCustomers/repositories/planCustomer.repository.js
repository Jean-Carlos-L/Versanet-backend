import { query } from "../../../common/utils/query.utils.js";

export class PlanCustomerRepository {
  static table = "clientes_planes";

  static async findAll(filters) {
    const { page = 1, pageSize = 50, status } = filters;
    let queryText = `SELECT 
         c.*,
         cp.id AS cliente_plan_id,
         cp.estado AS cliente_plan_estado,
         cp.ip_estatica,
         cp.mac_antena,
         cp.fecha_inicio,
         cp.fecha_fin,
         p.id AS plan_id,
         p.descripcion AS plan_descripcion,
         p.precio AS plan_precio,
         p.caracteristicas AS plan_caracteristicas
      FROM 
         clientes c 
      INNER JOIN ${this.table} cp ON 
         c.id = cp.idCliente 
      INNER JOIN planes p ON 
         cp.idPlan = p.id
      WHERE 1 = 1`;

    if (status) {
      queryText += ` AND cp.estado = '${status}'`;
    }

    queryText += ` ORDER BY cp.fecha_creacion DESC`;

    if (page && pageSize) {
      queryText += ` LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
    }

    const rows = await query(queryText);
    return rows;
  }

  static async enablePlan(id) {
    const queryText = `UPDATE ${this.table} SET estado = 1 WHERE id = ?`;
    const values = [id];
    const rows = await query(queryText, values);
    return rows;
  }

  static async disablePlan(id) {
    const queryText = `UPDATE ${this.table} SET estado = 0 WHERE id = ?`;
    const values = [id];
    const rows = await query(queryText, values);
    return rows;
  }
}
