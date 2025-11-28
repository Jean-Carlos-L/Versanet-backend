import { PaymentRepository } from "../../../infrastructure/repositories/paymentRepository.js";

const paymentRepository = new PaymentRepository();

async function getPaymentById(paymentId) {
  const result = await paymentRepository.findById(paymentId);
  return { message: "Pago encontrado correctamente", data: result };
}

export { getPaymentById };