import express from "express";
import {
  createRole,
  updateRole,
  getRoleById,
  getRoles,
  deleteRole,
} from "../controllers/role.controller.js";

const router = express.Router();

router.get("/", getRoles);

router.get("/:id", getRoleById);

router.post("/", createRole);

router.put("/:id", updateRole);

router.delete("/:id", deleteRole);

export default router;
