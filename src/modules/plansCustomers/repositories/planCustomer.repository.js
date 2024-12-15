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
        cp.fecha_inicio,
        cp.fecha_fin,
        p.id AS plan_id,
        p.descripcion AS plan_descripcion,
        p.precio AS plan_precio,
        p.caracteristicas AS plan_caracteristicas,
        im.id AS inventarioMac_id,
        im.referencia AS inventarioMac_referencia,
        im.mac AS inventarioMac_mac,
        im.ip AS inventarioMac_ip,
        im.idTipo AS inventarioMac_tipo,
        im.estado AS inventarioMac_estado,
        ir.id AS inventarioRouter_id,
        ir.referencia AS inventarioRouter_referencia,
        ir.mac AS inventarioRouter_mac,
        ir.ip AS inventarioRouter_ip,
        ir.idTipo AS inventarioRouter_tipo,
        ir.estado AS inventarioRouter_estado
      FROM 
        clientes c
      INNER JOIN ${this.table} cp ON 
        c.id = cp.idCliente
      INNER JOIN planes p ON 
        cp.idPlan = p.id
      LEFT JOIN inventario im ON 
        cp.idMac = im.id
      LEFT JOIN inventario ir ON 
        cp.idRouter = ir.id
      WHERE  1=1`;

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
    const sql = `
      INSERT INTO ${this.table} 
      (id, idCliente, idPlan, estado, fecha_inicio, fecha_fin, idMac, idRouter) 
      VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      planCustomer.idCustomer,
      planCustomer.idPlan,
      planCustomer.status,
      planCustomer.startDate,
      planCustomer.endDate,
      planCustomer.idMac,
      planCustomer.idRouter,
    ];
    const row = await query(sql, params);
    return row;
  }

  static async update(id, planCustomer) {
    const sql = `
      UPDATE ${this.table} 
      SET 
        idCliente = ?, 
        idPlan = ?, 
        estado = ?, 
        fecha_inicio = ?, 
        fecha_fin = ?, 
        idMac = ?, 
        idRouter = ? 
      WHERE id = ?
    `;
    const params = [
      planCustomer.idCustomer,
      planCustomer.idPlan,
      planCustomer.status,
      planCustomer.startDate,
      planCustomer.endDate,
      planCustomer.idMac,
      planCustomer.idRouter,
      id,
    ];
    await query(sql, params);
  }

  static async findById(id) {
    const sql = `
      SELECT 
        c.*,
        cp.id AS cliente_plan_id,
        cp.estado AS cliente_plan_estado,
        cp.fecha_inicio,
        cp.fecha_fin,
        p.id AS plan_id,
        p.descripcion AS plan_descripcion,
        p.precio AS plan_precio,
        p.caracteristicas AS plan_caracteristicas,
        im.id AS inventarioMac_id,
        im.referencia AS inventarioMac_referencia,
        im.mac AS inventarioMac_mac,
        im.ip AS inventarioMac_ip,
        im.idTipo AS inventarioMac_tipo,
        im.estado AS inventarioMac_estado,
        ir.id AS inventarioRouter_id,
        ir.referencia AS inventarioRouter_referencia,
        ir.mac AS inventarioRouter_mac,
        ir.ip AS inventarioRouter_ip,
        ir.idTipo AS inventarioRouter_tipo,
        ir.estado AS inventarioRouter_estado
      FROM 
        clientes c
      INNER JOIN ${this.table} cp ON 
        c.id = cp.idCliente
      INNER JOIN planes p ON 
        cp.idPlan = p.id
      LEFT JOIN inventario im ON 
        cp.idMac = im.id
      LEFT JOIN inventario ir ON 
        cp.idRouter = ir.id
      WHERE 
        cp.id = ?`;
    const row = await query(sql, [id]);
    return row[0];
  }

  static async delete(id) {
    const sql = `DELETE FROM ${this.table} WHERE id = ?`;
    await query(sql, [id]);
  }

  static async updateInventoryStatus(idInventory, status) {
    const sql = `UPDATE inventario SET estado = ? WHERE id = ?`;
    await query(sql, [status, idInventory]);
  }
}
