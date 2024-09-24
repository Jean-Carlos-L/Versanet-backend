import { query } from "../../../common/utils/query.utils.js";

export class RoleRepository {
  static table = "roles";

  static async create(role) {
    const newId = await query("SELECT UUID() as id");
    const id = newId[0].id;
    const sql = `INSERT INTO ${this.table} (id, descripcion, estado) VALUES (?, ?, ?)`;
    const params = [id, role.descripcion, role.estado];
    await query(sql, params);
    return id;
  }

  static async update(id, role) {
    const sql = `UPDATE ${this.table} SET descripcion = ?, estado = ? WHERE id = ?`;
    await query(sql, [role.descripcion, role.estado, id]);
  }

  static async findById(id) {
    const sql = `SELECT * FROM ${this.table} WHERE id = ? AND estado = 1`;
    const row = await query(sql, [id]);
    return row[0];
  }

  static async findAll() {
    const sql = `SELECT * FROM ${this.table} WHERE estado = 1`;
    return await query(sql);
  }

  static async delete(id) {
    const sql = `UPDATE ${this.table} SET estado = 0 WHERE id = ?`;
    await query(sql, [id]);
  }
}
