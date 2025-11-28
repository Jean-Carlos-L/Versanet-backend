import express from "express";
import {
  buildRegisterValidatorChain,
  buildEditValidatorChain,
} from "../../../infra_http/middlewares/validators/roles/index.js";
import {
  registerRole,
  listRoles,
  editRole,
  deleteRole,
  getRoleById,
} from "../usecases/index.js";
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
    console.error('enrichActor (roles) - failed to load user from DB', e && e.message ? e.message : e);
  }
  return actor;
}

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filters = req.query || {};
    const result = await listRoles({ filters });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const role = await getRoleById(id);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const userInput = req.body;
    const chain = buildRegisterValidatorChain();
    const validationResult = await chain.handle(userInput);
    if (!validationResult.ok) {
      return res.status(400).json({ error: validationResult.error });
    }

    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const newRole = await registerRole(userInput, actor);

    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "create",
        entity: "role",
        entity_id: newRole?.id || null,
        details: `${actorName || 'Usuario desconocido'} creó rol via API: id=${newRole?.id}`,
        metadata: { requestBody: userInput, result: newRole },
      });
    } catch (e) {
      console.error('roleController POST - activity log failed:', e && e.message ? e.message : e);
    }

    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userInput = req.body;
    const chain = buildEditValidatorChain();
    const validationResult = await chain.handle({ ...userInput, id });

    if (!validationResult.ok) {
      return res.status(400).json({ error: validationResult.error });
    }

    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const updatedRole = await editRole(id, userInput, actor);

    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "update",
        entity: "role",
        entity_id: updatedRole?.id || id,
        details: `${actorName || 'Usuario desconocido'} actualizó rol via API: id=${id}`,
        metadata: { requestBody: userInput, result: updatedRole },
      });
    } catch (e) {
      console.error('roleController PUT - activity log failed:', e && e.message ? e.message : e);
    }

    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const result = await deleteRole(id, actor);

    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "delete",
        entity: "role",
        entity_id: id,
        details: `${actorName || 'Usuario desconocido'} eliminó rol via API: id=${id}`,
        metadata: { requestParams: { id }, result },
      });
    } catch (e) {
      console.error('roleController DELETE - activity log failed:', e && e.message ? e.message : e);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
});

export default router;
