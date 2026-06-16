import express from "express";
import {
  registerContract,
  getAllContracts,
  getContractById,
  editContract,
  deleteContract,
  toggleStatus,
} from "../usecases/index.js";
import { buildRegisterContractValidatorChain } from "../../../infra_http/middlewares/validators/contracts/registerContractValidator.js";
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
    console.error('enrichActor (contracts) - failed to load user from DB', e && e.message ? e.message : e);
  }
  return actor;
}

router.post("/", async (req, res) => {
  const userInput = req.body;
  const chain = buildRegisterContractValidatorChain();
  const validationResult = await chain.handle(userInput);
  if (!validationResult.ok) {
    return res.status(400).json({ error: validationResult.error });
  }
  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const newContract = await registerContract(userInput, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "create",
        entity: "contract",
        entity_id: newContract?.id || null,
        details: `${actorName || 'Usuario desconocido'} creó contrato via API: id=${newContract?.id}`,
        metadata: { requestBody: userInput, result: newContract },
      });
    } catch (e) {
      console.error('contractController POST - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(201).json(newContract);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = parseInt(String(req.query.page)) || 1;
    const pageSize = parseInt(String(req.query.pageSize)) || 10;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const filters = {
      id: req.query.id || null,
      cliente_id: req.query.cliente_id || req.query.customer_id || null,
      plan: req.query.plan || req.query.plan_name || null,
      customer_name:
        req.query.customer_name || req.query.name || req.query.nombres || null,
      customer_document:
        req.query.customer_document ||
        req.query.cedula ||
        req.query.document ||
        null,
      date_from: req.query.date_from || req.query.fecha_desde || null,
      date_to: req.query.date_to || req.query.fecha_hasta || null,
      estado: req.query.estado || null,
    };

    const { contracts, total } = await getAllContracts({
      page,
      pageSize,
      offset,
      limit,
      filters,
    });

    res.status(200).json({
      data: contracts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const contract = await getContractById(req.params.id);
    res.status(200).json(contract);
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const updated = await editContract(req.params.id, req.body, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "update",
        entity: "contract",
        entity_id: updated?.id || req.params.id,
        details: `${actorName || 'Usuario desconocido'} actualizó contrato via API: id=${req.params.id}`,
        metadata: { requestBody: req.body, result: updated },
      });
    } catch (e) {
      console.error('contractController PUT - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error in contractController PUT /:id:", err);
    if (err.status === 404) return res.status(404).json({ error: err.message });
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.patch("/:id/toggle-status", async (req, res) => {
  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const result = await toggleStatus(req.params.id, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "toggle-status",
        entity: "contract",
        entity_id: req.params.id,
        details: `${actorName || 'Usuario desconocido'} cambió estado del contrato via API: id=${req.params.id}`,
        metadata: { requestParams: { id: req.params.id }, result },
      });
    } catch (e) {
      console.error('contractController TOGGLE - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(200).json(result);
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: err.message });
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const result = await deleteContract(req.params.id, actor);
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "delete",
        entity: "contract",
        entity_id: req.params.id,
        details: `${actorName || 'Usuario desconocido'} eliminó contrato via API: id=${req.params.id}`,
        metadata: { requestParams: { id: req.params.id }, result },
      });
    } catch (e) {
      console.error('contractController DELETE - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(200).json(result);
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: err.message });
    res.status(err.status || 400).json({ error: err.message });
  }
});

export default router;
