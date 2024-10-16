import { PlanRepository } from "../repositories/plan.repository.js";
import { planAdapterDTO } from "../adapters/plan.adapter.js";

export class PlanService {
  static async findAll() {
    try {
      const plans = await PlanRepository.findAll();
      return plans.map((plan) => planAdapterDTO(plan));
    } catch (error) {
      throw new Error("Error al obtener los planes: " + error.message);
    }
  }

  static async findById(id) {
    try {
      const plan = await PlanRepository.findById(id);
      if (!plan) {
        throw new Error("Plan no encontrado");
      }
      return planAdapterDTO(plan);
    } catch (error) {
      throw new Error("Error al obtener el plan: " + error.message);
    }
  }
}
