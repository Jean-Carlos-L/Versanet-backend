import CustomerEntity from "../../domain/entities/Customer.js";
import { CustomerModel } from "../models/customerModel.js";
import ActivityLogRepository from "./activityLogRepository.js";

export class CustomerRepository {
  async create(customerData, actor = null, options = {}) {
    const createOpts = {};
    if (options.transaction) createOpts.transaction = options.transaction;

    const customerRecord = await CustomerModel.create(
      {
        id: customerData.id,
        nombres: customerData.name,
        cedula: customerData.document,
        correo_electronico: customerData.email,
        telefono: customerData.phone,
        direccion: customerData.address,
      },
      createOpts
    );
    return new CustomerEntity(
      customerRecord.id,
      customerRecord.nombres,
      customerRecord.cedula,
      customerRecord.correo_electronico,
      customerRecord.telefono,
      customerRecord.direccion,
      customerRecord.estado
    );
  }

  async update(customerId, customerData, actor = null, options = {}) {
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;

    const customerRecord = await CustomerModel.findByPk(customerId);
    if (!customerRecord) {
      throw new Error("Customer not found");
    }
    customerRecord.nombres = customerData.name;
    customerRecord.cedula = customerData.document;
    customerRecord.correo_electronico = customerData.email;
    customerRecord.telefono = customerData.phone;
    customerRecord.direccion = customerData.address;
    await customerRecord.save(updateOpts);
    return new CustomerEntity(
      customerRecord.id,
      customerRecord.nombres,
      customerRecord.cedula,
      customerRecord.correo_electronico,
      customerRecord.telefono,
      customerRecord.direccion,
      customerRecord.estado
    );
  }

  async findById(customerId) {
    const customerRecord = await CustomerModel.findOne({where: { id: customerId, eliminado: false }});
    if (!customerRecord) {
      throw new Error("Customer not found");
    }
    return new CustomerEntity(
      customerRecord.id,
      customerRecord.nombres,
      customerRecord.cedula,
      customerRecord.correo_electronico,
      customerRecord.telefono,
      customerRecord.direccion,
      customerRecord.estado
    );
  }

  async findByEmail(email) {
    const customerRecord = await CustomerModel.findOne({
      where: { correo_electronico: email, eliminado: false },
    });
    if (!customerRecord) {
      return null;
    }
    return new CustomerEntity(
      customerRecord.id,
      customerRecord.nombres,
      customerRecord.cedula,
      customerRecord.correo_electronico,
      customerRecord.telefono,
      customerRecord.direccion,
      customerRecord.estado
    );
  }

  async findByDocument(document) {
    const customerRecord = await CustomerModel.findOne({
      where: { cedula: document, eliminado: false },
    });
    if (!customerRecord) {
      return null;
    }
    return new CustomerEntity(
      customerRecord.id,
      customerRecord.nombres,
      customerRecord.cedula,
      customerRecord.correo_electronico,
      customerRecord.telefono,
      customerRecord.direccion,
      customerRecord.estado
    );
  }

  async delete(customerId, actor = null, options = {}) {
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;

    const customerRecord = await CustomerModel.findByPk(customerId);
    if (!customerRecord) {
      throw new Error("Customer not found");
    }
    customerRecord.eliminado = true;
    await customerRecord.save(updateOpts);

    // Activity log
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || null;
      const details = `Cliente eliminado: id=${customerRecord.id}, nombre=${customerRecord.nombres}`;
      await ActivityLogRepository.create(
        {
          actor_id: actor?.id || null,
          actor_name: actorName,
          action: "delete",
          entity: "customer",
          entity_id: customerRecord.id,
          details,
        },
        { transaction: options.transaction }
      );
    } catch (e) {
      console.error("Activity log (customer delete) failed:", e && e.message ? e.message : e);
    }

    return true;
  }

  async findAll({ filters = {}, offset = 0, limit = 10 } = {}) {
    const where = { eliminado: false, ...filters };
    const customers = await CustomerModel.findAll({
      where,
      offset,
      limit,
    });
    return customers.map(
      (customerRecord) =>
        new CustomerEntity(
          customerRecord.id,
          customerRecord.nombres,
          customerRecord.cedula,
          customerRecord.correo_electronico,
          customerRecord.telefono,
          customerRecord.direccion,
          customerRecord.estado
        )
    );
  }

  async count({ filters = {} } = {}) {
    const where = { eliminado: false, ...filters };
    const count = await CustomerModel.count({ where });
    return count;
  }
}
