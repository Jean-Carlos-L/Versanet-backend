import express from "express";
import {
  createRole,
  updateRole,
  getRoleById,
  getRoles,
  deleteRole,
} from "../controllers/role.controller.js";
import { authorize } from "../../../common/core/role.middleware.js";

const router = express.Router();

router.get("/", getRoles);

router.get("/:id", authorize(["/roles/view"]), getRoleById);

router.post("/", authorize(["/roles/create"]), createRole);

router.put("/:id", authorize(["/roles/update"]), updateRole);

router.delete("/:id", authorize(["/roles/delete"]), deleteRole);

export default router;
