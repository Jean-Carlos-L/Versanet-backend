import { query } from "../../../common/utils/query.utils.js";

export class InvoiceRepository {
  static table = "facturas";

  static async create(data) {
    const sql = `INSERT INTO ${this.table} (id, idCliente, idCliente_Plan, fecha_facturacion, monto_total, estado) 
                 VALUES (UUID(), ?, ?, ?, ?, 1)`;
    const selectIdSql = `SELECT id FROM ${this.table} WHERE idCliente = ? ORDER BY fecha_facturacion DESC LIMIT 1`;

    // Realiza la inserción
    await query(sql, [
      data.id_cliente,
      data.id_cliente_plan,
      data.fecha_facturacion,
      data.monto_total,
    ]);

    // Recupera el ID generado
    const result = await query(selectIdSql, [data.id_cliente]);
    return result[0];
  }

  static async update(id, data) {
    const sql = `UPDATE ${this.table} SET ? WHERE id = ?`;
    return await query(sql, [data, id]);
  }

  static async paid(id) {
    const sql = `UPDATE ${this.table} SET estado = 0 WHERE id = ?`;
    return await query(sql, [id]);
  }

  static async findAll(filters) {
    const {
      page = 1,
      pageSize = 10,
      dateInvoice,
      customer,
      status,
      plan,
    } = filters;

    let sql = `
    SELECT 
      f.*,
      cp.idPlan,
      c.id AS cliente_id,
      c.nombres,
      c.cedula,
      c.correo_electronico,
      c.telefono,
      c.direccion,
      p.id AS plan_id,
      p.descripcion AS plan_descripcion,
      p.precio AS plan_precio,
      p.caracteristicas AS plan_caracteristicas
    FROM 
      facturas f
    JOIN 
      clientes_planes cp ON f.idCliente_Plan = cp.id
    INNER JOIN 
      planes p ON cp.idPlan = p.id
    INNER JOIN 
      clientes c ON f.idCliente = c.id
    WHERE 
      1 = 1
  `;
    const params = [];

    if (customer) {
      sql += ` AND f.idCliente = ?`;
      params.push(customer);
    }
    if (plan) {
      sql += ` AND cp.idPlan = ?`;
      params.push(plan);
    }
    if (status !== undefined && status !== "") {
      sql += ` AND f.estado = ?`;
      params.push(status);
    }

    if (dateInvoice) {
      sql += ` AND DATE(f.fecha_facturacion) = ?`;
      params.push(dateInvoice);
    }

    sql += ` ORDER BY f.fecha_facturacion DESC`;

    if (page && pageSize) {
      sql += ` LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
    }

    const result = await query(sql, params);
    return result;
  }

  static async countAll(filters) {
    const { dateInvoice, idCustomer, status, idPlan } = filters;

    let sql = `SELECT 
    COUNT(F.id) AS total
    FROM
      facturas F
    JOIN
    clientes_planes CP ON F.idCliente_Plan = CP.id
  JOIN
      planes p ON CP.idPlan = p.id
  JOIN
      clientes C ON F.idCliente = C.id
  WHERE
      1 = 1
  `;
    const params = [];

    if (idCustomer) {
      sql += ` AND F.idCliente = ?`;
      params.push(idCustomer);
    }
    if (idPlan) {
      sql += ` AND CP.idPlan = ?`;
      params.push(idPlan);
    }
    if (status !== undefined && status !== "") {
      sql += ` AND F.estado = ?`;
      params.push(status);
    }

    if (dateInvoice) {
      sql += ` AND DATE(F.fecha_facturacion) = ?`;
      params.push(dateInvoice);
    }

    const result = await query(sql, params);
    return result[0].total;
  }

  static async findById(id) {
    const sql = `SELECT * FROM ${this.table} WHERE id = ? AND estado = 1`;
    const result = await query(sql, [id]);
    return result[0];
  }

  static async findByCustomerPlanId(id) {
    const sql = `SELECT * FROM ${this.table} WHERE idCliente_Plan = ? AND estado = 1`;
    return await query(sql, [id]);
  }
}
