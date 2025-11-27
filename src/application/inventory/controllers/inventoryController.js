import express from "express";

import {
  registerInventory,
  getAllInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getInventoryCount,
} from "../usecases/index.js";


const router = express.Router();

router.post("/", async (req, res) => {
  const inventoryData = req.body;

  try {
    const newInventory = await registerInventory(inventoryData);
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
    const updatedInventory = await updateInventory(req.params.id, req.body);
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
    const result = await deleteInventory(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    if (err.message === "Inventario no encontrado") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router;
