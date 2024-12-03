import { PlanCustomerRepository } from "../repositories/planCustomer.repository.js";
import { planCustomerAdapterDTO, planCustomerAdapterEntity } from "../adapters/planCustomer.adapter.js";

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

  static async create(planCustomer) {
    try {
      return await PlanCustomerRepository.create( planCustomerAdapterEntity(planCustomer));
    } catch (error) {
      console.error("PlanCustomerService - create: ", error);
      throw new Error(error.message);
    }
  }

  static async update(id, planCustomer) {
    try {
      await PlanCustomerRepository.update(id, planCustomerAdapterEntity(planCustomer));
    } catch (error) {
      console.error("PlanCustomerService - update: ", error);
      throw new Error(error.message);
    }
  }

  static async findById(id) {
    try {
      const planCustomer = await PlanCustomerRepository.findById(id);
      return planCustomerAdapterDTO(planCustomer);
    } catch (error) {
      console.error("PlanCustomerService - findById: ", error);
      throw new Error(error.message);
    }
  }
  

  static async delete(id) {
    try {
      await PlanCustomerRepository.delete(id);
    } catch (error) {
      console.error("PlanCustomerService - delete: ", error);
      throw new Error(error.message);
    }
  }
}
