import express from "express";
import {
  createUser,
  updateUser,
  detailsUser,
  listUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authorize } from "../../../common/core/role.middleware.js";

const router = express.Router();

router.post("/", authorize(["/users/create"]), createUser);

router.put("/:id", authorize(["/users/update"]), updateUser);

router.get("/", authorize(["/users/view"]), listUser);

router.get("/:id", authorize(["/users/view"]), detailsUser);

router.delete("/delete/:id", authorize(["/users/delete"]), deleteUser);

export default router;
