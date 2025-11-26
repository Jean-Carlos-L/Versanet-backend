import { PlanRepository } from "../../../infrastructure/repositories/planRepository.js";
import { EditPlanDTO } from "../../../domain/dtos/editPlanDTO.js";

const planRepository = new PlanRepository();

async function editPlan(planId, userInput) {
  const planDTO = new EditPlanDTO(userInput);

  let existingPlan = await planRepository.findById(planId);
  if (!existingPlan) {
    const error = new Error("El plan no existe.");
    error.status = 404;
    throw error;
  }

  const result = await planRepository.update(planId, planDTO);
  return result;
}

export { editPlan };