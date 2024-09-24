import { query } from "../../../common/utils/query.utils.js";

export class PermissionRepository {
  static table = "permisos";

  static async findAll() {
    const sql = `SELECT * FROM ${this.table} WHERE estado = 1`;
    return await query(sql);
  }
}
