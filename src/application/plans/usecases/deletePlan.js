import { PlanRepository } from "../../../infrastructure/repositories/planRepository.js";

const planRepository = new PlanRepository();

async function deletePlan(planId) {
  const existingPlan = await planRepository.findById(planId);
  if (!existingPlan) {
    const error = new Error("El plan no existe.");
    error.status = 404;
    throw error;
  }

  await planRepository.delete(planId);
  return { message: "Plan eliminado exitosamente." };
}

export { deletePlan };