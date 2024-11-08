import express from "express";
import {
  createRole,
  updateRole,
  getRoleById,
  getRoles,
  deleteRole,
} from "../controllers/role.controller.js";
import { authMiddleware } from "../../../common/core/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getRoles);

router.get("/:id", getRoleById);

router.post("/", createRole);

router.put("/:id", updateRole);

router.delete("/:id", deleteRole);

export default router;
