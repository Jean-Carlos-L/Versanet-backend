import { query } from "../../../common/utils/query.utils.js";

export class CustomerRepository {
    static table = "clientes";


    static async create(customer) {
        const newId = await query("SELECT UUID() as id");
        const id = newId[0].id;
        const sql = `INSERT INTO ${this.table} (id, nombres,cedula, correo_electronico, telefono, direccion, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [id, customer.nombres, customer.cedula, customer.correo_electronico, customer.telefono, customer.direccion, 1];
        await query(sql, params);
        return id;
    }
    static async update(id, customer) {
        const sql = `UPDATE ${this.table} SET nombres = ?, correo_electronico = ?, telefono = ?, direccion = ?, estado = ? WHERE id = ?`;
        await query(sql, [customer.nombres, customer.correo_electronico, customer.telefono, customer.direccion, customer.estado, id]);
    }
    static async findById(id) {
        const sql = `SELECT * FROM ${this.table} WHERE id = ?`;
        const row = await query(sql, [id]);
        return row[0];
    }
    static async findAll() {
        const sql = `SELECT * FROM ${this.table}`;
        return await query(sql);
    }

    static async delete(id) {
        const sql = `UPDATE ${this.table} SET estado = 0 WHERE id = ?`;
        await query(sql, [id]);
    }

    static async findByFilter(filter) {
        const sql = `SELECT * FROM ${this.table} WHERE nombres LIKE ? OR correo_electronico LIKE ? OR cedula LIKE ?`;
        return await query(sql, [`%${filter}%`, `%${filter}%`, `%${filter}%`]);
    }

}