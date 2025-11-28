import express from "express";
import {
  buildRegisterValidatorChain,
  buildEditValidatorChain,
} from "../../../infra_http/middlewares/validators/users/index.js";
import {
  getUserById,
  deleteUser,
  editUser,
  listUsers,
  registerUser,
} from "../usecases/index.js";

const router = express.Router();

import { UserModel } from "../../../infrastructure/models/index.js";
import ActivityLogRepository from "../../../infrastructure/repositories/activityLogRepository.js";

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
    console.error('enrichActor (users) - failed to load user from DB', e && e.message ? e.message : e);
  }
  return actor;
}

router.get("/", async (req, res) => {
  const filters = req.query;

  try {
    const users = await listUsers({ filters });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const chain = buildRegisterValidatorChain();
  const validationResult = await chain.handle(req.body);
  if (!validationResult.ok)
    return res.status(400).json({ error: validationResult.error });

  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const user = await registerUser(req.body, actor);

    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "create",
        entity: "user",
        entity_id: user?.id || null,
        details: `${actorName || 'Usuario desconocido'} creó usuario via API: id=${user?.id}`,
        metadata: { requestBody: req.body, result: user },
      });
    } catch (e) {
      console.error('userController POST - activity log failed:', e && e.message ? e.message : e);
    }

    res.status(201).json({ data: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const userId = req.params.id;

  const chain = buildEditValidatorChain();
  const validationResult = await chain.handle({ ...req.body, id: userId });
  if (!validationResult.ok)
    return res.status(400).json({ error: validationResult.error });

  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const user = await editUser(userId, req.body, actor);

    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "update",
        entity: "user",
        entity_id: user?.id || userId,
        details: `${actorName || 'Usuario desconocido'} actualizó usuario via API: id=${userId}`,
        metadata: { requestBody: req.body, result: user },
      });
    } catch (e) {
      console.error('userController PUT - activity log failed:', e && e.message ? e.message : e);
    }

    res.status(200).json({ data: user });
  } catch (err) {
    res.status(err.status).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const result = await deleteUser(userId, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "delete",
        entity: "user",
        entity_id: userId,
        details: `${actorName || 'Usuario desconocido'} eliminó usuario via API: id=${userId}`,
        metadata: { requestParams: { id: userId }, result },
      });
    } catch (e) {
      console.error('userController DELETE - activity log failed:', e && e.message ? e.message : e);
    }

    res.status(200).json({ message: "Usuario eliminado correctamente." });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
