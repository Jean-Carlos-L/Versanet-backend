import { PlanRepository } from "../../../infrastructure/repositories/planRepository.js";
import { EditPlanDTO } from "../../../domain/dtos/editPlanDTO.js";
import { PlanModel } from "../../../infrastructure/models/planModel.js";

const planRepository = new PlanRepository();

async function editPlan(planId, userInput, actor = null) {
  const planDTO = new EditPlanDTO(userInput);

  let existingPlan = await planRepository.findById(planId);
  if (!existingPlan) {
    const error = new Error("El plan no existe.");
    error.status = 404;
    throw error;
  }

  if (PlanModel && PlanModel.sequelize) {
    const t = await PlanModel.sequelize.transaction();
    try {
      const result = await planRepository.update(planId, planDTO, actor, { transaction: t });
      await t.commit();
      return result;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  const result = await planRepository.update(planId, planDTO, actor);
  return result;
}

export { editPlan };