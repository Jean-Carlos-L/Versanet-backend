import { CustomerRepository } from "../../../infrastructure/repositories/customerRepository.js";

const customerRepository = new CustomerRepository();

async function deleteCustomer(customerId) {
  const existingCustomer = await customerRepository.findById(customerId);
  if (!existingCustomer) {
    const error = new Error("El cliente no existe.");
    error.status = 404;
    throw error;
  }

  await customerRepository.delete(customerId);
  return { message: "Cliente eliminado exitosamente." };
}

export { deleteCustomer };
