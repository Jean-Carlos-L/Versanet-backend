import { RegisterCustomerDTO } from "../../../domain/dtos/registerCustomerDTO.js";
import { CustomerRepository } from "../../../infrastructure/repositories/customerRepository.js";

const customerRepository = new CustomerRepository();

async function registerCustomer(userInput) {
    const customerDTO = new RegisterCustomerDTO(userInput);

    let existingCustomer = await customerRepository.findByEmail(customerDTO.email);
    if (existingCustomer) {
        const error = new Error("El correo electrónico ya está registrado.");
        error.status = 400;
        throw error;
    }

    existingCustomer = await customerRepository.findByDocument(customerDTO.document);
    if (existingCustomer) {
        const error = new Error("La cédula ya está registrada.");
        error.status = 400;
        throw error;
    }

    const result = await customerRepository.create(customerDTO);
    return result;
}

export { registerCustomer };