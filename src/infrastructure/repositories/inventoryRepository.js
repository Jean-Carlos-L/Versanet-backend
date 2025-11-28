import InventoryEntity from "../../domain/entities/Inventory.js";
import { InventoryModel } from "../models/inventoryModel.js";
import ActivityLogRepository from "./activityLogRepository.js";
import { Op } from "sequelize";

export class InventoryRepository {
  async create(inventoryData, actor = null, options = {}) {
    const createOpts = {};
    if (options.transaction) createOpts.transaction = options.transaction;

    const inventoryRecord = await InventoryModel.create(
      {
        id: inventoryData.id,
        referencia: inventoryData.reference,
        direccion_red: inventoryData.network_address,
        tipo_equipo: inventoryData.type,
        cantidad: inventoryData.quantity,
        estado: inventoryData.status,
      },
      createOpts
    );

    // Log activity if actor provided
    try {
      if (actor) {
        const actorName = actor.nombres || actor.name || actor.username || "desconocido";
        const details = `${actorName} agregó inventario: referencia=${inventoryRecord.referencia}, tipo=${inventoryRecord.tipo_equipo}, cantidad=${inventoryRecord.cantidad}`;
        await ActivityLogRepository.create(
          {
            actor_id: actor.id || null,
            actor_name: actorName,
            action: "create",
            entity: "inventory",
            entity_id: inventoryRecord.id,
            details,
          },
          { transaction: options.transaction }
        );
      } else {
        // no actor provided -> skip activity log creation
      }
    } catch (e) {
      console.error("Activity log create failed:", e.message || e);
    }
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
    console.log("Filters in repository:", filters);
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

  async update(id, data, actor = null, options = {}) {
    const payload = {
      referencia: data.reference,
      direccion_red: data.network_address,
      tipo_equipo: data.type,
      cantidad: data.quantity,
      estado: data.status,
    };

    const instanceBefore = await InventoryModel.findOne({ where: { id, eliminado: false } });
    if (!instanceBefore) return null;

    // Apply update on the instance to get hooks and timestamps
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;

    try {
      await instanceBefore.update({ ...payload, updatedAt: new Date() }, updateOpts);
    } catch (e) {
      // fallback to model update
      const [updatedCount] = await InventoryModel.update({ ...payload, updatedAt: new Date() }, { where: { id, eliminado: false }, ...(options.transaction ? { transaction: options.transaction } : {}) });
      if (updatedCount === 0) return null;
    }

    const instanceAfter = await InventoryModel.findOne({ where: { id, eliminado: false } });

    // Log changes
    try {
      if (actor) {
        const actorName = actor.nombres || actor.name || actor.username || "desconocido";
        const changes = [];
        const keys = ["referencia", "direccion_red", "tipo_equipo", "cantidad", "estado"];
        for (const k of keys) {
          const beforeVal = instanceBefore.get(k);
          const afterVal = instanceAfter.get(k);
          if (String(beforeVal) !== String(afterVal)) {
            changes.push(`${k}: ${beforeVal} -> ${afterVal}`);
          }
        }
        const details = changes.length > 0 ? `${actorName} actualizó inventario (${changes.join("; ")})` : `${actorName} actualizó inventario sin cambios detectables`;
        await ActivityLogRepository.create({
          actor_id: actor.id || null,
          actor_name: actorName,
          action: "update",
          entity: "inventory",
          entity_id: id,
          details,
        }, { transaction: options.transaction });
      }
    } catch (e) {
      console.error("Activity log update failed:", e.message || e);
    }

    return this.findById(id);
  }

  async softDelete(id, actor = null, options = {}) {
    const instanceBefore = await InventoryModel.findOne({ where: { id, eliminado: false } });
    if (!instanceBefore) return false;

    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;

    try {
      await instanceBefore.update({ eliminado: true, updatedAt: new Date() }, updateOpts);
    } catch (e) {
      const [deletedCount] = await InventoryModel.update({ eliminado: true, updatedAt: new Date() }, { where: { id, eliminado: false }, ...(options.transaction ? { transaction: options.transaction } : {}) });
      if (deletedCount === 0) return false;
    }

    // Log delete
    try {
      const actorName = actor?.nombres || actor?.name || actor?.username || null;
      const details = `Inventario eliminado: referencia=${instanceBefore.referencia}, tipo=${instanceBefore.tipo_equipo}, cantidad=${instanceBefore.cantidad}`;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "delete",
        entity: "inventory",
        entity_id: id,
        details,
      }, { transaction: options.transaction });
    } catch (e) {
      console.error("Activity log delete failed:", e.message || e);
    }

    return true;
  }
}
