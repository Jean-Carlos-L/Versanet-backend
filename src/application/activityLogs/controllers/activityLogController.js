import express from "express";
import { listActivityLogs } from "../usecases/listActivityLogs.js";
import ActivityLogRepository from "../../../infrastructure/repositories/activityLogRepository.js";
import { UserModel } from "../../../infrastructure/models/index.js";
const router = express.Router();

// Basic enrichActor helper reused pattern

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
    console.error('enrichActor (activityLogs) - failed to load user from DB', e && e.message ? e.message : e);
  }
  return actor;
}

// GET /api/activity-logs
router.get("/", async (req, res) => {
  try {
    // Optionally require a permission here: e.g. check req.session.user.role.permissions
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);

    const { page = 1, limit = 20, entity, actor_id, actor_name, action, q, from, to, sort } = req.query;
    const filters = {};
    if (entity) filters.entity = entity;
    if (actor_id) filters.actor_id = actor_id;
    if (actor_name) filters.actor_name = actor_name;
    if (action) filters.action = action;
    if (q) filters.q = q;
    if (from) filters.from = from;
    if (to) filters.to = to;

    const result = await listActivityLogs({ page: Number(page), limit: Number(limit), filters, sort });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Optional detail endpoint
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rec = await ActivityLogRepository.findAll({ filters: { id }, limit: 1, offset: 0 });
    if (!rec || !rec.rows || rec.rows.length === 0) return res.status(404).json({ error: "Log not found" });
    res.status(200).json(rec.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
