import { RegisterCustomerDTO } from "../../../domain/dtos/registerCustomerDTO.js";
import { CustomerRepository } from "../../../infrastructure/repositories/customerRepository.js";
import { createCustomerNotification } from "../utils/emails-templates/createCustomerNotification.js";
import { EmailStrategy } from "../../../infrastructure/email/notificationStrategies.js";
import { NotificationBuilder } from "../../../infrastructure/email/notificationBuilder.js";
import { CustomerModel } from "../../../infrastructure/models/customerModel.js";

const customerRepository = new CustomerRepository();

async function registerCustomer(userInput, actor = null) {
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

  // Run create in a transaction so audit record is atomic with customer create
  if (CustomerModel && CustomerModel.sequelize) {
    const t = await CustomerModel.sequelize.transaction();
    let result;
    try {
      result = await customerRepository.create(customerDTO, actor, { transaction: t });
      await t.commit();
    } catch (e) {
      try {
        await t.rollback();
      } catch (rbErr) {
        // If rollback fails because transaction already finished, log and continue
        console.error('Transaction rollback failed:', rbErr && rbErr.message ? rbErr.message : rbErr);
      }
      throw e;
    }

    // Send welcome email but don't attempt to rollback DB if email sending fails
    try {
      const emailHtml = createCustomerNotification({ customer: result });
      const email = new NotificationBuilder()
        .to(result.email)
        .subject("¡Bienvenido a Versanet!")
        .html(emailHtml)
        .build();
      await new EmailStrategy().send(email);
    } catch (emailErr) {
      console.error('Failed to send welcome email:', emailErr && emailErr.message ? emailErr.message : emailErr);
    }

    return result;
  }

  const result = await customerRepository.create(customerDTO, actor);

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
