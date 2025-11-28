import { CustomerRepository } from "../../../infrastructure/repositories/customerRepository.js";
import { CustomerModel } from "../../../infrastructure/models/customerModel.js";

const customerRepository = new CustomerRepository();

async function deleteCustomer(customerId, actor = null) {
  const existingCustomer = await customerRepository.findById(customerId);
  if (!existingCustomer) {
    const error = new Error("El cliente no existe.");
    error.status = 404;
    throw error;
  }

  if (CustomerModel && CustomerModel.sequelize) {
    const t = await CustomerModel.sequelize.transaction();
    try {
      await customerRepository.delete(customerId, actor, { transaction: t });
      await t.commit();
      return { message: "Cliente eliminado exitosamente." };
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  await customerRepository.delete(customerId, actor);
  return { message: "Cliente eliminado exitosamente." };
}

export { deleteCustomer };
