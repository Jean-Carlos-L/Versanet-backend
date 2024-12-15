import { query } from "../../../common/utils/query.utils.js";

export class InventoryRepository {
  static table = "inventario";
  static tipoTable = "tipo_inventario";
  static async findAll(filters) {
    const {
      page = 1,
      pageSize = 50,
      reference,
      mac,
      typeInventory,
      ip,
    } = filters;

    let queryText = `SELECT 
          i.id,
          i.referencia,
          i.mac,
          i.ip,
          i.estado,
          i.fecha_creacion,
          i.fecha_actualizacion,
          t.id AS tipo_id,
          t.descripcion AS tipo_descripcion
        FROM 
          ${this.table} i
        INNER JOIN ${this.tipoTable} t ON 
          i.idTipo = t.id
        WHERE 1 = 1`;

    const params = [];

    if (reference) {
      queryText += ` AND i.referencia LIKE ?`;
      params.push(`%${reference}%`);
    }

    if (mac) {
      queryText += ` AND i.mac LIKE ?`;
      params.push(`%${mac}%`);
    }
    if (ip) {
      queryText += ` AND i.ip LIKE ?`;
      params.push(`%${ip}%`);
    }
    if (typeInventory) {
      queryText += ` AND t.descripcion LIKE ?`;
      params.push(`%${typeInventory}%`);
    }

    if (page && pageSize) {
      queryText += ` LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
    }
    const rows = await query(queryText, params);
    return rows;
  }

  static async countInventories(filters) {
    const { status, reference, mac, tipo, ip } = filters;

    let queryText = `SELECT 
          COUNT(*) AS total
        FROM 
          inventario i
        INNER JOIN tipo_inventario ti ON 
          i.idTipo = ti.id
        WHERE 1 = 1`;

    const params = [];

    if (status) {
      queryText += ` AND i.estado = ?`;
      params.push(status);
    }

    if (reference) {
      queryText += ` AND i.referencia LIKE ?`;
      params.push(`%${reference}%`);
    }

    if (mac) {
      queryText += ` AND i.mac LIKE ?`;
      params.push(`%${mac}%`);
    }

    if (tipo) {
      queryText += ` AND ti.descripcion LIKE ?`;
      params.push(`%${tipo}%`);
    }
    if (ip) {
      queryText += ` AND i.ip LIKE ?`;
      params.push(`%${ip}%`);
    }

    const rows = await query(queryText, params);

    return rows[0].total;
  }

  static async create(inventory) {
    const newId = await query("SELECT UUID() as id");
    const id = newId[0].id;
    const sql = `INSERT INTO ${this.table} (id, referencia, mac, ip, estado, idTipo) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
      id,
      inventory.reference,
      inventory.mac,
      inventory.ip !== undefined ? inventory.ip : "No aplica",
      inventory.status !== undefined ? inventory.status : 1,
      inventory.idTipo,
    ];
    await query(sql, params);
    return id;
  }

  static async update(id, inventory) {
    const sql = `UPDATE ${this.table} SET referencia = ?, mac = ?, ip = ?, estado = ?, idTipo = ? WHERE id = ?`;
    const params = [
      inventory.reference,
      inventory.mac,
      inventory.ip,
      inventory.status,
      inventory.idTipo,
      id,
    ];
    await query(sql, params);
  }

  static async findById(id) {
    const sql = `SELECT 
          i.id,
          i.referencia,
          i.mac,
          i.ip,
          i.estado,
          i.fecha_creacion,
          i.fecha_actualizacion,
          t.id AS tipo_id,
          t.descripcion AS tipo_descripcion
        FROM 
          ${this.table} i
        INNER JOIN ${this.tipoTable} t ON 
          i.idTipo = t.id
        WHERE i.id = ?`;
    const row = await query(sql, [id]);
    return row[0];
  }

  static async delete(id) {
    const sql = `DELETE FROM ${this.table} WHERE id = ? AND estado = 0`;
    const result = await query(sql, [id]);
    if (result.affectedRows === 1) {
      throw new Error("No se puede eliminar un inventario asignado");
    }
  }

  static async findByReference(reference) {
    const sql = `SELECT * FROM ${this.table} WHERE referencia = ?`;
    const row = await query(sql, [reference]);
    return row[0];
  }

  static async findByExist(ip, mac, reference) {
    const sql = `SELECT * FROM ${this.table} WHERE ip = ? OR mac = ? OR referencia = ?`;
    const row = await query(sql, [ip, mac, reference]);
    return row[0];
  }
}
