import { RegisterPlanDTO } from "../../../domain/dtos/registerPlanDTO.js";
import { PlanRepository } from "../../../infrastructure/repositories/planRepository.js";

const planRepository = new PlanRepository();

async function registerPlan(userInput) {
  const planDTO = new RegisterPlanDTO(userInput);

  const result = await planRepository.create(planDTO);
  return result;
}

export { registerPlan };