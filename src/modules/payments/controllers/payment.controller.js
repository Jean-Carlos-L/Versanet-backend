import { PaymentService } from "../services/payment.service.js";

export const createPayment = async (req, res) => {
  try {
    const payment = req.body;
    const result = await PaymentService.createPayment(payment);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
