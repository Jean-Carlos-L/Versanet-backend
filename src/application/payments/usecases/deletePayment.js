import { PaymentRepository } from "../../../infrastructure/repositories/paymentRepository.js";

const paymentRepository = new PaymentRepository();

async function deletePayment(paymentId) {
  const result = await paymentRepository.delete(paymentId);
  return { message: "Pago eliminado correctamente", data: result };
}

export { deletePayment };
