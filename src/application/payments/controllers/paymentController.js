import express from "express";
import {
  registerPayment,
  editPayment,
  deletePayment,
  listPaymentsByInvoice,
  getPaymentById,
} from "../usecases/index.js";
import {
  buildEditPaymentValidatorChain,
  buildRegisterValidatorChain,
} from "../../../infra_http/middlewares/validators/payments/index.js";

const router = express.Router();

router.get("/invoice/:id", async (req, res) => {
  try {
    const result = await listPaymentsByInvoice(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error listing payments by invoice:", error);
    res.status(500).json({ message: "Error listing payments by invoice" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await getPaymentById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting payment by ID:", error);
    res.status(500).json({ message: "Error getting payment by ID" });
  }
});

router.post("/", async (req, res) => {
  try {
    const chain = buildRegisterValidatorChain();
    const validation = await chain.handle(req.body);
    if (!validation.ok) {
      return res.status(400).json({ message: validation.error });
    }
    const result = await registerPayment(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error registering payment:", error);
    res.status(500).json({ message: "Error al intentar crear el pago" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const chain = buildEditPaymentValidatorChain();
    const validation = await chain.handle({...req.body, id: req.params.id });
    if (!validation.ok) {
      return res.status(400).json({ message: validation.error });
    }
    const result = await editPayment({...req.body, id: req.params.id });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error editing payment:", error);
    res.status(500).json({ message: "Error editing payment" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await deletePayment(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ message: "Error deleting payment" });
  }
});

export default router;
