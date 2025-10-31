import { CustomerRepository } from "../../../infrastructure/repositories/customerRepository.js";

const customerRepository = new CustomerRepository();

async function getCustomerById(customerId) {
  const customer = await customerRepository.findById(customerId);
  return customer;
}

export { getCustomerById };