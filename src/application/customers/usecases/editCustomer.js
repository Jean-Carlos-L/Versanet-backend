import { CustomerRepository } from "../../../infrastructure/repositories/customerRepository.js";
import { EditCustomerDTO } from "../../../domain/dtos/editCustomerDTO.js";

const customerRepository = new CustomerRepository();

async function editCustomer(customerId, userInput) {
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

  const result = await customerRepository.update(customerId, customerDTO);
  return result;
}

export { editCustomer };
