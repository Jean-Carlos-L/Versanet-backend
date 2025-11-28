import { PlanRepository } from "../../../infrastructure/repositories/planRepository.js";
import { PlanModel } from "../../../infrastructure/models/planModel.js";

const planRepository = new PlanRepository();

async function deletePlan(planId, actor = null) {
  const existingPlan = await planRepository.findById(planId);
  if (!existingPlan) {
    const error = new Error("El plan no existe.");
    error.status = 404;
    throw error;
  }

  if (PlanModel && PlanModel.sequelize) {
    const t = await PlanModel.sequelize.transaction();
    try {
      await planRepository.delete(planId, actor, { transaction: t });
      await t.commit();
      return { message: "Plan eliminado exitosamente." };
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  await planRepository.delete(planId, actor);
  return { message: "Plan eliminado exitosamente." };
}

export { deletePlan };