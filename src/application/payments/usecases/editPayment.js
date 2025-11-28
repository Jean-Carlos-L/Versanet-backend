import { PaymentRepository } from "../../../infrastructure/repositories/paymentRepository.js";
import { EditPaymentDTO } from "../../../domain/dtos/paymentDTOs/editPaymentDTO.js";

const paymentRepository = new PaymentRepository();

async function editPayment(userInput) {
  const paymentDTO = new EditPaymentDTO(userInput);

  const result = await paymentRepository.update(paymentDTO.id , paymentDTO);
  return { message: "Pago editado correctamente", data: result };
}

export { editPayment };