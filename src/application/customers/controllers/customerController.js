import express from "express";
import {
  listCustomers,
  editCustomer,
  registerCustomer,
  deleteCustomer,
  getCustomerById,
} from "../usecases/index.js";
import {
  buildEditValidatorChain,
  buildRegisterValidatorChain,
} from "../../../infra_http/middlewares/validators/customers/index.js";
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
    console.error('enrichActor (customers) - failed to load user from DB', e && e.message ? e.message : e);
  }
  return actor;
}

router.get("/", async (req, res) => {
  const filters = req.query;

  try {
    const customers = await listCustomers({ filters });
    res.status(200).json(customers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await getCustomerById(id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(customer);
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
    const newCustomer = await registerCustomer(userInput, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "create",
        entity: "customer",
        entity_id: newCustomer?.id || null,
        details: `${actorName || 'Usuario desconocido'} creó cliente via API: id=${newCustomer?.id}, nombre=${newCustomer?.nombres || newCustomer?.name}`,
        metadata: { requestBody: userInput, result: newCustomer },
      });
    } catch (e) {
      console.error('customerController POST - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(201).json(newCustomer);
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
    const updatedCustomer = await editCustomer(id, userInput, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "update",
        entity: "customer",
        entity_id: updatedCustomer?.id || id,
        details: `${actorName || 'Usuario desconocido'} actualizó cliente via API: id=${id}`,
        metadata: { requestBody: userInput, result: updatedCustomer },
      });
    } catch (e) {
      console.error('customerController PUT - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const result = await deleteCustomer(id, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "delete",
        entity: "customer",
        entity_id: id,
        details: `${actorName || 'Usuario desconocido'} eliminó cliente via API: id=${id}`,
        metadata: { requestParams: { id }, result },
      });
    } catch (e) {
      console.error('customerController DELETE - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

export default router;
