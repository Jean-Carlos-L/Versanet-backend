import { RegisterContractDTO } from "../../../domain/dtos/ContractDTO/registerContractDTO.js";
import { ContractRepository } from "../../../infrastructure/repositories/contractRepository.js";
import { EmailStrategy } from "../../../infrastructure/email/notificationStrategies.js";
import { NotificationBuilder } from "../../../infrastructure/email/notificationBuilder.js";
import { createContractNotification } from "./utils/email-templates/createContractNotification.js";

const contractRepository = new ContractRepository();

async function registerContract(userInput) {
  const contractDTO = new RegisterContractDTO(userInput);
  const result = await contractRepository.create(contractDTO);

  const contract = await contractRepository.findById(result.id);

  const emailHtml = createContractNotification({ contract });

  const email = new NotificationBuilder()
    .to(contract.customer.email)
    .subject("Nuevo Contrato Registrado")
    .html(emailHtml)
    .build();
  await new EmailStrategy().send(email);

  return result;
}

export { registerContract };
