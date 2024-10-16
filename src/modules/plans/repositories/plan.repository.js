import { query } from "../../../common/utils/query.utils.js";

export class PlanRepository {
  static table = "planes";

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
