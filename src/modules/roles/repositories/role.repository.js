import { query } from "../../../common/utils/query.utils.js";

export class RoleRepository {
  
    static table= 'roles';

    static async createRol(role){
        const sql = `INSERT INTO ${this.table} (id, nombre, descripcion, estado) VALUES (UUID(), ?, ?, ?)`;
        const params = [role.nombre, role.descripcion, role.estado];
        await query(sql, params);
    }

    static async updateRol(role){
        const sql = `UPDATE ${this.table} SET nombre = ? WHERE id = ?`;
        await query(sql, [role.id, role.nombre]);
    }

    static async findById(id){
        const sql = `SELECT * FROM ${this.table} WHERE id = ?`;
        return await query(sql, [id]);
    }

    static async findAll(){
        const sql = `SELECT * FROM ${this.table}`;
        return await query(sql);
    }

    static async deleteRol(id){
        const sql = `DELETE FROM ${this.table} WHERE id = ?`;
        await query(sql, [id]);
    }

}