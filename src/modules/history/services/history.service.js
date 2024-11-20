import { HistoryRepository } from "../repositories/history.repository.js";

export class HistoryService {
  /**
   * Obtiene las notificaciones de una entidad específica.
   * @param {string} entity - Nombre de la entidad.
   * @returns {Promise<Object>} Notificaciones de la entidad.
   */
  static async getHistoryByEntity(entity, filters) {
    try {
      const notifications = await HistoryRepository.findByEntity(
        entity,
        filters
      );
      return {
        message: "Notificaciones encontradas con éxito",
        data: notifications,
      };
    } catch (error) {
      throw new Error(`Error obteniendo notificaciones: ${error.message}`);
    }
  }

  /**
   * Obtiene el total de notificaciones de una entidad específica.
   * @param {string} entity - Nombre de la entidad.
   * @returns {Promise<Object>} Total de notificaciones.
   */
  static async countHistoryByEntity(entity) {
    try {
      const total = await HistoryRepository.countByEntity(entity);
      return total;
    } catch (error) {
      throw new Error(
        `Error obteniendo total de notificaciones: ${error.message}`
      );
    }
  }

  /**
   * Obtiene una notificación específica por ID.
   * @param {string} id - ID de la notificación.
   * @returns {Promise<Object>} Notificación específica.
   */
  static async getHistoryById(id) {
    try {
      const notification = await HistoryRepository.findById(id);
      if (!notification) {
        throw new Error("Notificación no encontrada");
      }
      return {
        message: "Notificación encontrada con éxito",
        data: notification,
      };
    } catch (error) {
      throw new Error(`Error obteniendo notificación: ${error.message}`);
    }
  }

  /**
   * Obtiene todas las notificaciones.
   * @returns {Promise<Object>} Todas las notificaciones.
   */
  static async getAllHistory() {
    try {
      const notifications = await HistoryRepository.findAll();
      return {
        message: "Todas las notificaciones obtenidas con éxito",
        data: notifications,
      };
    } catch (error) {
      throw new Error(`Error obteniendo notificaciones: ${error.message}`);
    }
  }
}
