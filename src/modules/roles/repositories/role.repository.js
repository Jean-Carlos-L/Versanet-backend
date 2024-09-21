import { query } from "../../../common/utils/query.utils.js";
import {v4} from 'uuid';

class RolRepository {
  
    static table= 'roles';

    static async createRol(role){
        //luego probamos lo del v4
        const sql = `INSERT INTO ${this.table} (id, name) VALUES (?, ?)`;
        await query(sql, [role.id, role.name]);
    }

    static async updateRol(role){
        const sql = `UPDATE ${this.table} SET name = ? WHERE id = ?`;
        await query(sql, [role.name, role.id]);
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