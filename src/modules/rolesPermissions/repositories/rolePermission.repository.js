import { query } from "../../../common/utils/query.utils.js";

export class RolePermissionRepository {
  static table = "roles_permisos";

  static async create(rolePermission) {
    const sql = `INSERT INTO ${this.table} (id, idRol, idPermiso) VALUES (UUID(), ?, ?)`;
    const params = [rolePermission.idRol, rolePermission.idPermiso];
    const row = await query(sql, params);
    return row;
  }

  static async findByRoleIds(ids) {
    const sql = `SELECT rp.*, p.descripcion permiso, p.url, p.estado FROM ${this.table} rp
         INNER JOIN permisos p ON p.id = rp.idPermiso
         WHERE rp.idRol IN (?)`;
    const rows = await query(sql, [ids]);
    return rows;
  }

  static async delete(id) {
    const sql = `DELETE FROM ${this.table} WHERE id = ?`;
    await query(sql, [id]);
  }

  static async deleteByRoleId(roleId) {
    const sql = `DELETE FROM ${this.table} WHERE idRol = ?`;
    await query(sql, [roleId]);
  }

  static async deleteByRoleIds(roleIds) {
    const sql = `DELETE FROM ${this.table} WHERE idRol IN (?)`;
    await query(sql, [roleIds]);
  }
}
