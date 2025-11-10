import { RegisterCustomerDTO } from "../../../domain/dtos/registerCustomerDTO.js";
import { CustomerRepository } from "../../../infrastructure/repositories/customerRepository.js";
import { createCustomerNotification } from "../utils/emails-templates/createCustomerNotification.js";
import { EmailStrategy } from "../../../infrastructure/email/notificationStrategies.js";
import { NotificationBuilder } from "../../../infrastructure/email/notificationBuilder.js";

const customerRepository = new CustomerRepository();

async function registerCustomer(userInput) {
  const customerDTO = new RegisterCustomerDTO(userInput);

  let existingCustomer = await customerRepository.findByEmail(
    customerDTO.email
  );
  if (existingCustomer) {
    const error = new Error("El correo electrónico ya está registrado.");
    error.status = 400;
    throw error;
  }

  existingCustomer = await customerRepository.findByDocument(
    customerDTO.document
  );
  if (existingCustomer) {
    const error = new Error("La cédula ya está registrada.");
    error.status = 400;
    throw error;
  }

  const result = await customerRepository.create(customerDTO);

  const emailHtml = createCustomerNotification({ customer: result });

  const email = new NotificationBuilder()
    .to(result.email)
    .subject("¡Bienvenido a Versanet!")
    .html(emailHtml)
    .build();
  await new EmailStrategy().send(email);

  return result;
}

export { registerCustomer };
