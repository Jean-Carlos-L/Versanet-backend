import { PlanCustomerRepository } from "../repositories/planCustomer.repository.js";
import {
  planCustomerAdapterDTO,
  planCustomerAdapterEntity,
} from "../adapters/planCustomer.adapter.js";
import { sendEmail } from "../../../common/utils/mailer.util.js";
import { CustomerRepository } from "../../customers/repositories/costumer.repository.js";
import { PlanRepository } from "../../plans/repositories/plan.repository.js";

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
      return await PlanCustomerRepository.countPlansCustomers(filters);
    } catch (error) {
      console.error(
        "PlanCustomerService - countPlansCustomers: ",
        error.message
      );
      throw new Error("Error al contar los planes de los clientes.");
    }
  }

  static async enablePlan(id) {
    try {
      return await PlanCustomerRepository.enablePlan(id);
    } catch (error) {
      console.error("PlanCustomerService - enablePlan: ", error.message);
      throw new Error("Error al habilitar el plan del cliente.");
    }
  }

  static async disablePlan(id) {
    try {
      return await PlanCustomerRepository.disablePlan(id);
    } catch (error) {
      console.error("PlanCustomerService - disablePlan: ", error.message);
      throw new Error("Error al deshabilitar el plan del cliente.");
    }
  }

  static async create(planCustomer) {
    try {
      const customer = await this._validateCustomer(planCustomer.customer.id);
      const plan = await this._validatePlan(planCustomer.plan.id);

      await PlanCustomerRepository.create(
        planCustomerAdapterEntity(planCustomer)
      );

      const subject = "Tu Plan de Internet ha sido Contratado";
      const htmlContent = this._generateEmailContent(
        customer,
        plan,
        planCustomer,
        "contratado"
      );
      await sendEmail(customer.correo_electronico, subject, htmlContent);

      return "El plan del cliente ha sido creado y se ha enviado el correo de confirmación.";
    } catch (error) {
      console.error("PlanCustomerService - create: ", error.message);
      throw new Error(error.message || "Error al crear el plan del cliente.");
    }
  }

  static async update(id, planCustomer) {
    try {
      const currentPlanCustomer = await PlanCustomerRepository.findById(id);
      if (!currentPlanCustomer)
        throw new Error("El plan del cliente no existe.");

      const customer = await this._validateCustomer(planCustomer.customer.id);
      const plan = await this._validatePlan(planCustomer.plan.id);

      await PlanCustomerRepository.update(id, planCustomer);

      const subject = "Tu Plan de Internet ha sido Actualizado";
      const htmlContent = this._generateEmailContent(
        customer,
        plan,
        planCustomer,
        "actualizado"
      );
      await sendEmail(customer.correo_electronico, subject, htmlContent);

      return "El plan del cliente ha sido actualizado correctamente.";
    } catch (error) {
      console.error("PlanCustomerService - update: ", error.message);
      throw new Error(
        error.message || "Error al actualizar el plan del cliente."
      );
    }
  }

  static async findById(id) {
    try {
      const planCustomer = await PlanCustomerRepository.findById(id);
      if (!planCustomer) throw new Error("El plan del cliente no existe.");
      return planCustomerAdapterDTO(planCustomer);
    } catch (error) {
      console.error("PlanCustomerService - findById: ", error.message);
      throw new Error("Error al obtener el plan del cliente.");
    }
  }

  static async delete(id) {
    try {
      const planCustomer = await PlanCustomerRepository.findById(id);
      if (!planCustomer) throw new Error("El plan del cliente no existe.");

      const customer = await this._validateCustomer(planCustomer.customer.id);

      await PlanCustomerRepository.delete(id);

      const subject = "Eliminación de tu Plan de Internet";
      const htmlContent = `
      <p>Hola ${customer.nombres},</p>
      <p>Te informamos que tu plan de internet ha sido eliminado de nuestro sistema.</p>
      <p>Por favor, contáctanos si esto fue un error.</p>`;
      await sendEmail(customer.correo_electronico, subject, htmlContent);

      return "El plan del cliente ha sido eliminado correctamente.";
    } catch (error) {
      console.error("PlanCustomerService - delete: ", error.message);
      throw new Error(
        error.message || "Error al eliminar el plan del cliente."
      );
    }
  }

  // Métodos privados

  static async _validateCustomer(customerId) {
    const customer = await CustomerRepository.findById(customerId);
    if (!customer) throw new Error("Cliente no encontrado.");
    return customer;
  }

  static async _validatePlan(planId) {
    const plan = await PlanRepository.findById(planId);
    if (!plan) throw new Error("Plan no encontrado o no disponible.");
    return plan;
  }

  static async updateInventory(idInventory, status) {
    try {
      await PlanCustomerRepository.updateInventoryStatus(idInventory, status);
    } catch (error) {
      console.error("PlanCustomerService - updateInventory: ", error);
      throw new Error(error.message);
    }
  }

  static _generateEmailContent(customer, plan, planCustomer, action) {
    const { startDate, endDate } = planCustomer;
    return `
      <html>
        <body>
          <p>Hola ${customer.nombres},</p>
          <p>Tu plan de internet ha sido ${action}. Detalles:</p>
          <ul>
            <li>Nombre del Plan: ${plan.descripcion}</li>
            <li>Vigencia: ${startDate} a ${endDate}</li>
          </ul>
          <p>¡Gracias por confiar en nosotros!</p>
        </body>
      </html>`;
  }
}
