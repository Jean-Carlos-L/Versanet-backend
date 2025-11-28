import { PaymentRepository } from "../../../infrastructure/repositories/paymentRepository.js";
import { RegisterPaymentDTO } from "../../../domain/dtos/paymentDTOs/registerPaymentoDTO.js";

const paymentRepository = new PaymentRepository();

async function registerPayment(userInput) {
  try {
    const paymentDTO = new RegisterPaymentDTO(userInput);

    const result = await paymentRepository.create(paymentDTO);
    return { message: "Pago registrado correctamente", data: result };
  } catch (error) {
    console.error("Error registering payment:", error);
    throw new Error("Error registering payment");
  }
}

export { registerPayment };
