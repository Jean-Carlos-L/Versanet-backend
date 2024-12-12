import { PlanCustomerRepository } from "../repositories/planCustomer.repository.js";
import { planCustomerAdapterDTO, planCustomerAdapterEntity } from "../adapters/planCustomer.adapter.js";
import { sendEmail } from "../../../common/utils/mailer.util.js";
import { CustomerRepository } from "../../customers/repositories/costumer.repository.js";
import { PlanRepository } from "../../plans/repositories/plan.repository.js";

export class PlanCustomerService {
  // Encuentra todos los planes de los clientes con filtros
  static async findAll(filters) {
    try {
      const plansCustomers = await PlanCustomerRepository.findAll(filters);
      return plansCustomers.map(planCustomerAdapterDTO);
    } catch (error) {
      console.error("PlanCustomerService - findAll: ", error.message);
      throw new Error("Error al obtener los planes de los clientes.");
    }
  }

  // Cuenta todos los planes de los clientes con filtros
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

  // Habilita un plan
  static async enablePlan(id) {
    try {
      return await PlanCustomerRepository.enablePlan(id);
    } catch (error) {
      console.error("PlanCustomerService - enablePlan: ", error.message);
      throw new Error("Error al habilitar el plan del cliente.");
    }
  }

  // Deshabilita un plan
  static async disablePlan(id) {
    try {
      return await PlanCustomerRepository.disablePlan(id);
    } catch (error) {
      console.error("PlanCustomerService - disablePlan: ", error.message);
      throw new Error("Error al deshabilitar el plan del cliente.");
    }
  }

  // Crea un plan para un cliente
  static async create(planCustomer) {
    try {
      
      // Validar duplicados de IP o MAC
      await this._validateDuplicatePlan(planCustomer);

      // Validar cliente y plan
      const customer = await this._validateCustomer(planCustomer.customer.id);
      const plan = await this._validatePlan(planCustomer.plan.id);

      // Crear plan
      await PlanCustomerRepository.create(planCustomer);

      // Enviar correo de notificación
      const subject = "Tu Plan de Internet ha sido Contratado";
      const htmlContent = this._generateEmailContent(
        customer,
        plan,
        planCustomer,
        "contratado"
      );
      await this._sendNotification(
        customer.correo_electronico,
        subject,
        htmlContent
      );

      return "El plan del cliente ha sido creado y se ha enviado el correo de confirmación.";
    } catch (error) {
      console.error("PlanCustomerService - create: ", error.message);
      throw new Error(error.message || "Error al crear el plan del cliente.");
    }
  }

  // Actualiza un plan de cliente
  static async update(id, planCustomer) {
    try {
      // Validar existencia del plan actual
      const currentPlanCustomer = await PlanCustomerRepository.findById(id);
      if (!currentPlanCustomer)
        throw new Error("El plan del cliente no existe.");

      // Validar cliente y plan
      const customer = await this._validateCustomer(planCustomer.customer.id);
      const plan = await this._validatePlan(planCustomer.plan.id);

      // Actualizar plan
      await PlanCustomerRepository.update(id, planCustomer);

      // Enviar correo de notificación
      const subject = "Tu Plan de Internet ha sido Actualizado";
      const htmlContent = this._generateEmailContent(
        customer,
        plan,
        planCustomer,
        "actualizado"
      );
      await this._sendNotification(
        customer.correo_electronico,
        subject,
        htmlContent
      );

      return "El plan del cliente ha sido actualizado correctamente.";
    } catch (error) {
      console.error("PlanCustomerService - update: ", error.message);
      throw new Error(
        error.message || "Error al actualizar el plan del cliente."
      );
    }
  }

  // Encuentra un plan por su ID
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

      // Enviar notificación de eliminación
      const subject = "Eliminación de tu Plan de Internet";
      const htmlContent = `
      <p>Hola ${customer.nombres},</p>
      <p>Te informamos que tu plan de internet ha sido eliminado de nuestro sistema.</p>
      <p>Por favor, contáctanos si esto fue un error.</p>`;
      await this._sendNotification(
        customer.correo_electronico,
        subject,
        htmlContent
      );

      return "El plan del cliente ha sido eliminado correctamente.";
    } catch (error) {
      console.error("PlanCustomerService - delete: ", error.message);
      throw new Error(
        error.message || "Error al eliminar el plan del cliente."
      );
    }
  }

  // Métodos privados

  static async _validateDuplicatePlan(planCustomer) {
    const existingPlan = await PlanCustomerRepository.findByStaticIpOrMac(
      planCustomer.staticIp,
      planCustomer.mac
    );
    if (existingPlan.length) {
      throw new Error("La dirección IP o MAC ya se encuentra registrada.");
    }
  }

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

  static async _sendNotification(email, subject, htmlContent) {
    try {
      await sendEmail(email, subject, htmlContent);
    } catch (error) {
      console.error(`Error enviando correo a ${email}:`, error.message);
      throw new Error("No se pudo enviar el correo de notificación.");
    }
  }

  static async updateInventory(idInventory, status){
    try {
      await PlanCustomerRepository.updateInventoryStatus(idInventory, status);
    } catch (error) {
      console.error("PlanCustomerService - updateInventory: ", error);
      throw new Error(error.message);
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
