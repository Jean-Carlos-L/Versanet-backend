import express from "express";
import {
  listInvoices,
  editInvoice,
  registerInvoice,
  deleteInvoice,
  getInvoiceById,
  payInvoice,
  getInvoicesByCustomer,
  getInvoicesByContract,
} from "../usescases/index.js";
import {
  buildEditValidatorChain,
  buildRegisterValidatorChain,
} from "../../../infra_http/middlewares/validators/invoices/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const filters = req.query;

  try {
    const invoices = await listInvoices({ filters });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await getInvoiceById(id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(200).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/customer/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    const invoices = await getInvoicesByCustomer(customerId);
    res.status(200).json(invoices);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/contract/:contractId", async (req, res) => {
  const { contractId } = req.params;

  try {
    const invoices = await getInvoicesByContract(contractId);
    res.status(200).json(invoices);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const userInput = req.body;
  const chain = buildRegisterValidatorChain();
  const validationResult = await chain.handle(userInput);
  if (!validationResult.ok)
    return res.status(400).json({ error: validationResult.error });

  try {
    const newInvoice = await registerInvoice(userInput);
    res.status(201).json(newInvoice);
  } catch (err) {
    console.error(err);
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const userInput = req.body;
  const chain = buildEditValidatorChain();
  const validationResult = await chain.handle({ ...userInput, id });
  if (!validationResult.ok)
    return res.status(400).json({ error: validationResult.error });

  try {
    const updatedInvoice = await editInvoice(id, userInput);
    res.status(200).json(updatedInvoice);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.patch("/:id/pay", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await payInvoice(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteInvoice(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

export default router;