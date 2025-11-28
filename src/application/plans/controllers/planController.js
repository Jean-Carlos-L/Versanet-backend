import express from "express";
import {
  listPlans,
  editPlan,
  registerPlan,
  deletePlan,
  getPlanById,
} from "../usecases/index.js";
import {
  buildEditValidatorChain,
  buildRegisterValidatorChain,
} from "../../../infra_http/middlewares/validators/plans/index.js";

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
    console.error('enrichActor (plans) - failed to load user from DB', e && e.message ? e.message : e);
  }
  return actor;
}

router.get("/", async (req, res) => {
  const filters = req.query;

  try {
    const plans = await listPlans({ filters });
    res.status(200).json(plans);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await getPlanById(id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(200).json(plan);
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
    const newPlan = await registerPlan(userInput, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "create",
        entity: "plan",
        entity_id: newPlan?.id || null,
        details: `${actorName || 'Usuario desconocido'} creó plan via API: id=${newPlan?.id}, descripcion=${newPlan?.description}`,
        metadata: { requestBody: userInput, result: newPlan },
      });
    } catch (e) {
      console.error('planController POST - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(201).json(newPlan);
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
    const updatedPlan = await editPlan(id, userInput, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "update",
        entity: "plan",
        entity_id: updatedPlan?.id || id,
        details: `${actorName || 'Usuario desconocido'} actualizó plan via API: id=${id}`,
        metadata: { requestBody: userInput, result: updatedPlan },
      });
    } catch (e) {
      console.error('planController PUT - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(200).json(updatedPlan);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const result = await deletePlan(id, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "delete",
        entity: "plan",
        entity_id: id,
        details: `${actorName || 'Usuario desconocido'} eliminó plan via API: id=${id}`,
        metadata: { requestParams: { id }, result },
      });
    } catch (e) {
      console.error('planController DELETE - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

export default router;