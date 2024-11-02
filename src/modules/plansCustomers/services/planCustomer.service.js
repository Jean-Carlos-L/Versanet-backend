import { PlanCustomerRepository } from "../repositories/planCustomer.repository.js";
import { planCustomerAdapterDTO } from "../adapters/planCustomer.adapter.js";

export class PlanCustomerService {
  static async findAll(filters) {
    try {
      const plansCustomers = await PlanCustomerRepository.findAll(filters);
      return plansCustomers.map((plan) => planCustomerAdapterDTO(plan));
    } catch (error) {
      console.error("PlanCustomerService - findAll: ", error);
      throw new Error(error.message);
    }
  }

  static async countPlansCustomers(filters) {
    try {
      const total = await PlanCustomerRepository.countPlansCustomers(filters);
      return total;
    } catch (error) {
      console.error("PlanCustomerService - countPlansCustomers: ", error);
      throw new Error(error.message);
    }
  }

  static async enablePlan(id) {
    try {
      const rows = await PlanCustomerRepository.enablePlan(id);
      return rows;
    } catch (error) {
      console.error("PlanCustomerService - enablePlan: ", error);
      throw new Error(error.message);
    }
  }

  static async disablePlan(id) {
    try {
      const rows = await PlanCustomerRepository.disablePlan(id);
      return rows;
    } catch (error) {
      console.error("PlanCustomerService - disablePlan: ", error);
      throw new Error(error.message);
    }
  }
}
