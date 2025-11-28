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

import { UserModel } from "../../../infrastructure/models/index.js";
import ActivityLogRepository from "../../../infrastructure/repositories/activityLogRepository.js";

const router = express.Router();

async function enrichActor(actor) {
  if (!actor) return null;
  if (actor.nombres || actor.name) return actor;
  try {
    if (actor.id) {
      const dbUser = await UserModel.findOne({ where: { id: actor.id, eliminado: false }, attributes: { exclude: ["contrasena", "eliminado"] } });
      if (dbUser) return { ...actor, ...dbUser.toJSON() };
    }
    if (actor.email) {
      const dbUser = await UserModel.findOne({ where: { correo_electronico: actor.email, eliminado: false }, attributes: { exclude: ["contrasena", "eliminado"] } });
      if (dbUser) return { ...actor, ...dbUser.toJSON() };
    }
  } catch (e) {
    console.error('enrichActor (invoices) - failed to load user from DB', e && e.message ? e.message : e);
  }
  return actor;
}

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
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const newInvoice = await registerInvoice(userInput, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "create",
        entity: "invoice",
        entity_id: newInvoice?.id || null,
        details: `${actorName || 'Usuario desconocido'} creó factura via API: id=${newInvoice?.id}, monto=${newInvoice?.amount}`,
        metadata: { requestBody: userInput, result: newInvoice },
      });
    } catch (e) {
      console.error('invoiceController POST - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(201).json(newInvoice);
  } catch (err) {
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
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const updatedInvoice = await editInvoice(id, userInput, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "update",
        entity: "invoice",
        entity_id: updatedInvoice?.id || id,
        details: `${actorName || 'Usuario desconocido'} actualizó factura via API: id=${id}`,
        metadata: { requestBody: userInput, result: updatedInvoice },
      });
    } catch (e) {
      console.error('invoiceController PUT - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(200).json(updatedInvoice);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.patch("/:id/pay", async (req, res) => {
  const { id } = req.params;

  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const result = await payInvoice(id, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "update-status",
        entity: "invoice",
        entity_id: id,
        details: `${actorName || 'Usuario desconocido'} marcó factura como pagada via API: id=${id}`,
        metadata: { requestParams: { id }, result },
      });
    } catch (e) {
      console.error('invoiceController PAY - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const result = await deleteInvoice(id, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "delete",
        entity: "invoice",
        entity_id: id,
        details: `${actorName || 'Usuario desconocido'} eliminó factura via API: id=${id}`,
        metadata: { requestParams: { id }, result },
      });
    } catch (e) {
      console.error('invoiceController DELETE - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

export default router;