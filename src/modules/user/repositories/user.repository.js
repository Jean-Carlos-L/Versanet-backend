import { query } from "../../../common/utils/query.utils.js";

export class UserRepository {
  // Función para crear un usuario
  static async createUser(user) {
    const sql = `INSERT INTO usuarios (id, nombres, correo_electronico, contrasena, idRol, estado) 
                 VALUES (UUID(), ?, ?, ?, ?, ?)`;
    const params = [user.nombres, user.correo_electronico, user.contrasena, user.idRol, user.estado];
    await query( sql, params );
}

  // Función para actualizar un usuario
  static async updateUser(user) {
    const sql = `UPDATE usuarios SET name = ?, email = ?, password = ? WHERE id = ?`;
    await query(sql, [user.name, user.email, user.password, user.id]);
  }

  // Función para buscar un usuario por su id
  static async findById(id) {
    const sql = `SELECT * FROM usuarios WHERE id = ?`;
    return await query(sql, [id]);
  }

  // Función para buscar todos los usuarios
  static async findAll() {
    const sql = `SELECT * FROM usuarios`;
    return await query(sql);
  }

  // Función para eliminar un usuario
  static async deleteUser(id) {
    const sql = `DELETE FROM usuarios WHERE id = ?`;
    await query(sql, [id]);
  }
}
