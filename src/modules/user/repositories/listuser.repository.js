import db from "../../common/config/mysql.connection.js"; // conexión a la BD

export class UserRepository {
  static async getUsers({ limit, offset, nombre, correo, rol }) {
    const queryParams = [];
    let query = `SELECT u.id, u.nombres, u.correo_electronico, r.nombre as rol
                 FROM usuarios u
                 LEFT JOIN roles r ON u.idRol = r.id
                 WHERE 1=1`;

    // Filtros dinámicos
    if (nombre) {
      query += ` AND u.nombres LIKE ?`;
      queryParams.push(`%${nombre}%`);
    }
    if (correo) {
      query += ` AND u.correo_electronico LIKE ?`;
      queryParams.push(`%${correo}%`);
    }
    if (rol) {
      query += ` AND r.nombre LIKE ?`;
      queryParams.push(`%${rol}%`);
    }

    // Paginación
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(Number(limit), Number(offset));

    const [rows] = await db.execute(query, queryParams);
    return rows;
  }

  static async getTotalUsers({ nombre, correo, rol }) {
    const queryParams = [];
    let query = `SELECT COUNT(*) as total
                 FROM usuarios u
                 LEFT JOIN roles r ON u.idRol = r.id
                 WHERE 1=1`;

    // Filtros
    if (nombre) {
      query += ` AND u.nombres LIKE ?`;
      queryParams.push(`%${nombre}%`);
    }
    if (correo) {
      query += ` AND u.correo_electronico LIKE ?`;
      queryParams.push(`%${correo}%`);
    }
    if (rol) {
      query += ` AND r.nombre LIKE ?`;
      queryParams.push(`%${rol}%`);
    }

    const [result] = await db.execute(query, queryParams);
    return result[0].total;
  }
}
