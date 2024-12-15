import express from "express";
import {
  createInventory,
  updateInventory,
  getInventoryById,
  getInventories,
  deleteInventory,
  getInventoryByReference,
  getCountInventories,
} from "../controllers/inventory.controller.js";

import { authMiddleware } from "../../../common/core/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getInventories);
router.get("/count", getCountInventories);
router.post("/", createInventory);
router.put("/:id", updateInventory);
router.get("/:id", getInventoryById);
router.delete("/delete/:id", deleteInventory);
router.get("/reference/:reference", getInventoryByReference);

export default router;
