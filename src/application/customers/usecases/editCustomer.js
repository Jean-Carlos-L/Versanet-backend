import { CustomerRepository } from "../../../infrastructure/repositories/customerRepository.js";
import { EditCustomerDTO } from "../../../domain/dtos/editCustomerDTO.js";
import { CustomerModel } from "../../../infrastructure/models/customerModel.js";

const customerRepository = new CustomerRepository();

async function editCustomer(customerId, userInput, actor = null) {
  const customerDTO = new EditCustomerDTO(userInput);

  let existingCustomer = await customerRepository.findById(customerId);
  if (!existingCustomer) {
    const error = new Error("El cliente no existe.");
    error.status = 404;
    throw error;
  }

  existingCustomer = await customerRepository.findByEmail(customerDTO.email);
  if (existingCustomer && existingCustomer.id !== customerId) {
    const error = new Error(
      "El correo electrónico ya está registrado por otro cliente."
    );
    error.status = 400;
    throw error;
  }

  // Use transaction to ensure update + audit are atomic
  if (CustomerModel && CustomerModel.sequelize) {
    const t = await CustomerModel.sequelize.transaction();
    try {
      const result = await customerRepository.update(customerId, customerDTO, actor, { transaction: t });
      await t.commit();
      return result;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  const result = await customerRepository.update(customerId, customerDTO, actor);
  return result;
}

export { editCustomer };
