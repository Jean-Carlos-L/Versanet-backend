import PlanEntity from "../../domain/entities/Plan.js";
import { PlanModel } from "../models/planModel.js";
import ActivityLogRepository from "./activityLogRepository.js";

export class PlanRepository {
  async create(planData, actor = null, options = {}) {
    const createOpts = {};
    if (options.transaction) createOpts.transaction = options.transaction;

    const planRecord = await PlanModel.create(
      {
        id: planData.id,
        descripcion: planData.description,
        caracteristicas: planData.features,
        precio: planData.price,
        duracion: planData.duration,
      },
      createOpts
    );
    return new PlanEntity({
      id: planRecord.id,
      description: planRecord.descripcion,
      features: planRecord.caracteristicas,
      price: planRecord.precio,
      duration: planRecord.duracion,
      status: planRecord.estado,
    });
  }

  async update(planId, planData, actor = null, options = {}) {
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;

    const planRecord = await PlanModel.findByPk(planId);
    if (!planRecord) {
      throw new Error("Plan not found");
    }
    planRecord.descripcion = planData.description;
    planRecord.caracteristicas = planData.features;
    planRecord.precio = planData.price;
    planRecord.duracion = planData.duration;
    planRecord.estado = planData.status;

    await planRecord.save(updateOpts);

    // Activity log
    try {
      if (actor) {
        const actorName = actor.nombres || actor.name || actor.email || null;
        const details = `Plan actualizado: id=${planId}, descripcion=${planRecord.descripcion}`;
        await ActivityLogRepository.create({
          actor_id: actor.id || null,
          actor_name: actorName,
          action: "update",
          entity: "plan",
          entity_id: planId,
          details,
        }, { transaction: options.transaction });
      }
    } catch (e) {
      console.error('Activity log (plan update) failed:', e && e.message ? e.message : e);
    }
    return new PlanEntity({
      id: planRecord.id,
      description: planRecord.descripcion,
      features: planRecord.caracteristicas,
      price: planRecord.precio,
      duration: planRecord.duracion,
      status: planRecord.estado,
    });
  }

  async findById(planId) {
    const planRecord = await PlanModel.findOne({
      where: { id: planId, eliminado: false },
    });
    if (!planRecord) {
      throw new Error("Plan not found");
    }
    return new PlanEntity({
      id: planRecord.id,
      description: planRecord.descripcion,
      features: planRecord.caracteristicas,
      price: planRecord.precio,
      duration: planRecord.duracion,
      status: planRecord.estado,
    });
  }

  async findAll({ filters = {}, offset = 0, limit = 10 } = {}) {
    const where = { eliminado: false, ...filters };
    const planRecords = await PlanModel.findAll({
      where,
      offset,
      limit,
    });
    return planRecords.map(
      (planRecord) =>
        new PlanEntity({
          id: planRecord.id,
          description: planRecord.descripcion,
          features: planRecord.caracteristicas,
          price: planRecord.precio,
          duration: planRecord.duracion,
          status: planRecord.estado,
        })
    );
  }

  async count({ filters = {} } = {}) {
    const where = { eliminado: false, ...filters };
    const count = await PlanModel.count({ where });
    return count;
  }

  async findByDescription(description) {
    const planRecord = await PlanModel.findOne({
      where: {
        descripcion: description,
        eliminado: false,
      },
    });

    if (!planRecord) return null;
    return new PlanEntity({
      id: planRecord.id,
      description: planRecord.descripcion,
      features: planRecord.caracteristicas,
      price: planRecord.precio,
      duration: planRecord.duracion,
      status: planRecord.estado,
    });
  }

  async delete(planId, actor = null, options = {}) {
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;

    const planRecord = await PlanModel.findByPk(planId);
    if (!planRecord) {
      throw new Error("Plan not found");
    }
    planRecord.eliminado = true;
    await planRecord.save(updateOpts);

    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || null;
      const details = `Plan eliminado: id=${planRecord.id}, descripcion=${planRecord.descripcion}`;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "delete",
        entity: "plan",
        entity_id: planRecord.id,
        details,
      }, { transaction: options.transaction });
    } catch (e) {
      console.error('Activity log (plan delete) failed:', e && e.message ? e.message : e);
    }

    return true;
  }
}
