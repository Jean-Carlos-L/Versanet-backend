import { PlanRepository } from "../../../infrastructure/repositories/planRepository.js";

const planRepository = new PlanRepository();

async function getPlanById(planId) {
  const plan = await planRepository.findById(planId);
  return plan;
}

export { getPlanById };