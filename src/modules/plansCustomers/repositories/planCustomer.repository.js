import { query } from "../../../common/utils/query.utils.js";

export class PlanCustomerRepository {
  static table = "clientes_planes";

  static async findAll(filters) {
    const {
      page = 1,
      pageSize = 50,
      status,
      plan,
      customer,
      startDate,
      endDate,
    } = filters;
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

    const params = [];
    if (status) {
      queryText += ` AND cp.estado = ?`;
      params.push(status);
    }

    if (plan) {
      queryText += ` AND p.descripcion LIKE ?`;
      params.push(`%${plan}%`);
    }

    if (customer) {
      queryText += ` AND (c.nombres LIKE ? OR c.cedula LIKE ? OR c.correo_electronico LIKE ?)`;
      params.push(`%${customer}%`, `%${customer}%`, `%${customer}%`);
    }

    if (startDate) {
      queryText += ` AND cp.fecha_inicio = ?`;
      params.push(startDate);
    }

    if (endDate) {
      queryText += ` AND cp.fecha_fin = ?`;
      params.push(endDate);
    }

    queryText += ` ORDER BY cp.fecha_creacion DESC`;

    if (page && pageSize) {
      queryText += ` LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
    }

    const rows = await query(queryText, params);
    return rows;
  }

  static async countPlansCustomers(filters) {
    const { status, plan, customer, startDate, endDate } = filters;
    let queryText = `SELECT 
          COUNT(*) AS total
        FROM 
           clientes c 
        INNER JOIN ${this.table} cp ON 
           c.id = cp.idCliente 
        INNER JOIN planes p ON 
           cp.idPlan = p.id
        WHERE 1 = 1`;

    const params = [];
    if (status) {
      queryText += ` AND cp.estado = ?`;
      params.push(status);
    }

    if (plan) {
      queryText += ` AND p.descripcion LIKE ?`;
      params.push(`%${plan}%`);
    }

    if (customer) {
      queryText += ` AND (c.nombres LIKE ? OR c.cedula LIKE ? OR c.correo_electronico LIKE ?)`;
      params.push(`%${customer}%`, `%${customer}%`, `%${customer}%`);
    }

    if (startDate) {
      queryText += ` AND cp.fecha_inicio = ?`;
      params.push(startDate);
    }

    if (endDate) {
      queryText += ` AND cp.fecha_fin = ?`;
      params.push(endDate);
    }

    const rows = await query(queryText, params);
    return rows[0].total;
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

  static async create(planCustomer) {
    const newId = await query("SELECT UUID() as id");
    const id = newId[0].id;
    const sql = `INSERT INTO ${this.table} (id,idCliente, idPlan, estado, ip_estatica, mac_antena, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      id,
      planCustomer.customer.id,
      planCustomer.plan.id,
      planCustomer.status,
      planCustomer.staticIp,
      planCustomer.mac,
      planCustomer.startDate,
      planCustomer.endDate,
    ];
    await query(sql, params);
    return id;
  }

  static async update(id, planCustomer) {
    const sql = `UPDATE ${this.table} SET idCliente=?, idPlan=?,estado = ?, ip_estatica = ?, mac_antena = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = ?`;
    await query(sql, [
      planCustomer.customer.id,
      planCustomer.plan.id,
      planCustomer.status,
      planCustomer.staticIp,
      planCustomer.mac,
      planCustomer.startDate,
      planCustomer.endDate,
      id,
    ]);
  }

  static async findById(id) {
    const sql = `SELECT c.*,
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
      WHERE cp.id = ?`;
    const row = await query(sql, [id]);
    return row[0];
  }

  static async delete(id) {
    const sql = `DELETE FROM ${this.table} WHERE id = ?`;
    await query(sql, [id]);
  }

  static async findByStaticIpOrMac(ip, mac) {
    const sql = `SELECT * FROM ${this.table} WHERE ip_estatica = ? OR mac_antena = ?`;
    const result = await query(sql, [ip, mac]);
    return result;
  }
}
