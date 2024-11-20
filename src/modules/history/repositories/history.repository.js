import { query } from "../../../common/utils/query.utils.js";

export class HistoryRepository {
  static table = "historial";

  /**
   * Valida si la entidad solicitada es válida.
   * @param {string} entity - Nombre de la entidad.
   * @returns {boolean}
   */
  static validateEntity(entity) {
    const validEntities = [
      "clientes",
      "clientes_planes",
      "facturas",
      "pagos",
      "usuarios",
      "permisos",
      "roles",
      "roles_permisos",
      "facturas_pagos",
      "planes",
    ];
    return validEntities.includes(entity);
  }

  // filtrar por fecha inicio
  /**
   * Obtiene las notificaciones de una entidad específica.
   * @param {string} entity - Nombre de la entidad.
   * @param {Object} filters - Filtros de búsqueda.
   * @returns {Promise<Array>} Lista de notificaciones.
   */
  static async findByEntity(entity, filters) {
    if (!this.validateEntity(entity)) {
      throw new Error(`Entidad no válida: ${entity}`);
    }

    const { startDate, page = 1, pageSize = 10 } = filters;

    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    let sql = `
      SELECT * 
      FROM ${this.table} 
      WHERE entidad = ? 
    `;

    const params = [entity];
    if (startDate) {
      sql += `AND fecha_historial >= ? `;
      params.push(startDate);
    }

    sql += `
      ORDER BY fecha_historial DESC
      LIMIT ? OFFSET ?
    `;
    params.push(limit, offset);

    return await query(sql, params);
  }

  // contar notificaciones
  /**
   * Obtiene el total de notificaciones de una entidad específica.
   * @param {string} entity - Nombre de la entidad.
   * @returns {Promise<number>} Total de notificaciones.
   */
  static async countByEntity(entity) {
    if (!this.validateEntity(entity)) {
      throw new Error(`Entidad no válida: ${entity}`);
    }

    const sql = `
      SELECT COUNT(*) AS total 
      FROM ${this.table} 
      WHERE entidad = ?
    `;
    const params = [entity];

    const rows = await query(sql, params);
    return rows[0].total;
  }

  /**
   * Obtiene todas las notificaciones de todas las entidades.
   * @returns {Promise<Array>} Lista de todas las notificaciones.
   */
  static async findAll() {
    const sql = `
      SELECT * 
      FROM ${this.table} 
      ORDER BY fecha_historial DESC
    `;
    return await query(sql);
  }
}
