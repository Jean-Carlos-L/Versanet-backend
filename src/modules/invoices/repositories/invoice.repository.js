import { query } from "../../../common/utils/query.utils.js";

export class InvoiceRepository {
  static table = "facturas";

  static async create(data) {
    const sql = `INSERT INTO ${this.table} (id, idCliente, fecha_facturacion, monto_total, estado) 
                 VALUES (UUID(), ?, ?, ?, 1)`;
    const selectIdSql = `SELECT id FROM ${this.table} WHERE idCliente = ? ORDER BY fecha_facturacion DESC LIMIT 1`;

    // Realiza la inserción
    await query(sql, [
      data.id_cliente,
      data.fecha_facturacion,
      data.monto_total,
    ]);

    // Recupera el ID generado
    const result = await query(selectIdSql, [data.id_cliente]);
    return result[0]; // Retorna el objeto con el ID generado
  }

  static async update(id, data) {
    const sql = `UPDATE ${this.table} SET ? WHERE id = ?`;
    return await query(sql, [data, id]);
  }

  static async paid(id) {
    const sql = `UPDATE ${this.table} SET estado = 0 WHERE id = ?`;
    return await query(sql, [id]);
  }

  static async findAll() {
    const sql = `SELECT * FROM ${this.table} WHERE estado = 1`;
    return await query(sql);
  }

  static async findById(id) {
    const sql = `SELECT * FROM ${this.table} WHERE id = ? AND estado = 1`;
    const result = await query(sql, [id]);
    return result[0];
  }
}
