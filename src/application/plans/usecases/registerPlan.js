import { RegisterPlanDTO } from "../../../domain/dtos/registerPlanDTO.js";
import { PlanRepository } from "../../../infrastructure/repositories/planRepository.js";
import { PlanModel } from "../../../infrastructure/models/planModel.js";

const planRepository = new PlanRepository();

async function registerPlan(userInput, actor = null) {
  const planDTO = new RegisterPlanDTO(userInput);

  if (PlanModel && PlanModel.sequelize) {
    const t = await PlanModel.sequelize.transaction();
    try {
      const result = await planRepository.create(planDTO, actor, { transaction: t });
      await t.commit();
      return result;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  const result = await planRepository.create(planDTO, actor);
  return result;
}

export { registerPlan };