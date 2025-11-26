import PlanEntity from "../../domain/entities/Plan.js";
import { PlanModel } from "../models/planModel.js";

export class PlanRepository {
  async create(planData) {
    const planRecord = await PlanModel.create({
      id: planData.id,
      descripcion: planData.description,
      caracteristicas: planData.features,
      precio: planData.price,
      duracion: planData.duration,
    });
    return new PlanEntity({
      id: planRecord.id,
      description: planRecord.descripcion,
      features: planRecord.caracteristicas,
      price: planRecord.precio,
      duration: planRecord.duracion,
      status: planRecord.estado,
    });
  }

  async update(planId, planData) {
    const planRecord = await PlanModel.findByPk(planId);
    if (!planRecord) {
      throw new Error("Plan not found");
    }
    planRecord.descripcion = planData.description;
    planRecord.caracteristicas = planData.features;
    planRecord.precio = planData.price;
    planRecord.duracion = planData.duration;
    planRecord.estado = planData.status;

    await planRecord.save();
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

  async delete(planId) {
    const planRecord = await PlanModel.findByPk(planId);
    if (!planRecord) {
      throw new Error("Plan not found");
    }
    planRecord.eliminado = true;
    await planRecord.save();
    return true;
  }
}
