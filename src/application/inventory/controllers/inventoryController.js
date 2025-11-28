import express from "express";

import {
  registerInventory,
  getAllInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getInventoryCount,
} from "../usecases/index.js";
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
    console.error('enrichActor - failed to load user from DB', e && e.message ? e.message : e);
  }
  return actor;
}

router.post("/", async (req, res) => {
  const inventoryData = req.body;

  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const newInventory = await registerInventory(inventoryData, actor);
    // Controller-level audit log (API-level)
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "create",
        entity: "inventory",
        entity_id: newInventory?.id || null,
        details: `${actorName || 'Usuario desconocido'} creó inventario via API: referencia=${newInventory?.referencia}`,
        metadata: { requestBody: inventoryData, result: newInventory },
      });
    } catch (e) {
      console.error('inventoryController POST - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(201).json(newInventory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = parseInt(String(req.query.page)) || 1;
    const pageSize = parseInt(String(req.query.pageSize)) || 10;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const filters = {
      referencia: req.query.referencia,
      mac: req.query.mac || "",
      direccion_red: req.query.direccion_red || "",
      tipo_equipo: req.query.tipo_equipo || "",
      estado: req.query.estado || "",
    };

    const { inventories, total } = await getAllInventories({
      ...filters,
      page,
      pageSize,
      offset,
      limit,
    });

    res.status(200).json({
      data: inventories,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/count", async (req, res) => {
  try {
    const filters = {
      referencia: req.query.referencia,
      mac: req.query.mac || "",
      direccion_red: req.query.direccion_red || "",
      tipo_equipo: req.query.tipo_equipo || "",
      estado: req.query.estado || "",
    };
    const total = await getInventoryCount(filters);
    res.status(200).json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const inventory = await getInventoryById(req.params.id);
    res.status(200).json(inventory);
  } catch (err) {
    if (err.message === "Inventario no encontrado") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const updatedInventory = await updateInventory(req.params.id, req.body, actor);
    // Controller-level audit log for update
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "update",
        entity: "inventory",
        entity_id: updatedInventory?.id || req.params.id,
        details: `${actorName || 'Usuario desconocido'} actualizó inventario via API: id=${req.params.id}`,
        metadata: { requestBody: req.body, result: updatedInventory },
      });
    } catch (e) {
      console.error('inventoryController PUT - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(200).json(updatedInventory);
  } catch (err) {
     console.error(err);
    if (err.message === "Inventario no encontrado o no actualizado") {
      return res.status(404).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let actor = req.session ? req.session.user : null;
    actor = await enrichActor(actor);
    const result = await deleteInventory(req.params.id, actor);
    // Controller-level audit log for delete
    try {
      const actorName = actor?.nombres || actor?.name || actor?.email || actor?.id || null;
      await ActivityLogRepository.create({
        actor_id: actor?.id || null,
        actor_name: actorName,
        action: "delete",
        entity: "inventory",
        entity_id: req.params.id,
        details: `${actorName || 'Usuario desconocido'} eliminó inventario via API: id=${req.params.id}`,
        metadata: { requestParams: req.params, result },
      });
    } catch (e) {
      console.error('inventoryController DELETE - activity log failed:', e && e.message ? e.message : e);
    }
    res.status(200).json(result);
  } catch (err) {
    if (err.message === "Inventario no encontrado") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router;
