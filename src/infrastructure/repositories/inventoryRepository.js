import InventoryEntity from "../../domain/entities/Inventory.js";
import { InventoryModel } from "../models/inventoryModel.js";
import { Op } from "sequelize";

export class InventoryRepository {
  async create(inventoryData) {
    const inventoryRecord = await InventoryModel.create({
      id: inventoryData.id,
      referencia: inventoryData.reference,
      direccion_red: inventoryData.network_address,
      tipo_equipo: inventoryData.type,
      cantidad: inventoryData.quantity,
      estado: inventoryData.status,
    });
    return new InventoryEntity({
      id: inventoryRecord.id,
      referencia: inventoryRecord.referencia,
      direccion_red: inventoryRecord.direccion_red,
      tipo_equipo: inventoryRecord.tipo_equipo,
      cantidad: inventoryRecord.cantidad,
      estado: inventoryRecord.estado,
      eliminado: inventoryRecord.eliminado,
      createdAt: inventoryRecord.createdAt,
      updatedAt: inventoryRecord.updatedAt,
    });
  }

  async findAll() {
    return await InventoryModel.findAll({
      where: { eliminado: false },
      attributes: { exclude: ["eliminado"] },
      order: [["createdAt", "DESC"]],
    });
  }

  async findAndCountAll({ filters = {}, offset, limit } = {}) {
    const where = { eliminado: false };
    if (filters.referencia && filters.referencia.trim()) {
      where.referencia = { [Op.like]: `%${filters.referencia.trim()}%` };
    }
    if (filters.direccion_red && filters.direccion_red.trim()) {
      where.direccion_red = { [Op.like]: `%${filters.direccion_red.trim()}%` };
    }
    if (filters.tipo_equipo && filters.tipo_equipo.trim()) {
      where.tipo_equipo = filters.tipo_equipo.trim();
    }
    if (filters.estado != null && filters.estado !== "") {
      const estadoMapped =
        filters.estado === "1" ||
        filters.estado === 1 ||
        filters.estado === "activo"
          ? "activo"
          : "inactivo";
      where.estado = estadoMapped;
    }

    const options = {
      where,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["eliminado"] },
    };

    if (offset != null && limit != null) {
      options.offset = offset;
      options.limit = limit;
    }

    const result = await InventoryModel.findAndCountAll(options);

    return result;
  }

  async count({ filters = {} } = {}) {
    const where = { eliminado: false };

    if (filters.referencia && filters.referencia.trim()) {
      where.referencia = { [Op.like]: `%${filters.referencia.trim()}%` };
    }
    if (filters.direccion_red && filters.direccion_red.trim()) {
      where.direccion_red = { [Op.like]: `%${filters.direccion_red.trim()}%` };
    }
    if (filters.tipo_equipo && filters.tipo_equipo.trim()) {
      where.tipo_equipo = { [Op.like]: `%${filters.tipo_equipo.trim()}%` };
    }
    if (filters.estado != null && filters.estado !== "") {
      const estadoMapped =
        filters.estado === "1" ||
        filters.estado === 1 ||
        filters.estado === "activo"
          ? "activo"
          : "inactivo";
      where.estado = estadoMapped;
    }

    return await InventoryModel.count({ where });
  }

  async findById(id) {
    return await InventoryModel.findOne({
      where: {
        id: id,
        eliminado: false,
      },
      attributes: { exclude: ["eliminado"] },
    });
  }

  async update(id, data) {
    const payload = {
      referencia: data.reference,
      direccion_red: data.network_address,
      tipo_equipo: data.type,
      cantidad: data.quantity,
      estado: data.status,
    };

    const [updatedCount] = await InventoryModel.update(
      {
        ...payload,
        updatedAt: new Date(),
      },
      {
        where: {
          id: id,
          eliminado: false,
        },
        returning: true, // Para PostgreSQL, en MySQL usa individualHooks
      }
    );
    if (updatedCount === 0) return null;
    return this.findById(id);
  }

  async softDelete(id) {
    const [deletedCount] = await InventoryModel.update(
      {
        eliminado: true,
        updatedAt: new Date(),
      },
      {
        where: {
          id: id,
          eliminado: false,
        },
      }
    );
    return deletedCount > 0;
  }
}
