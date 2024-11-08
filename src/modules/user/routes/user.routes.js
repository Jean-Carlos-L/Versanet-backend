import express from "express";
import {
  createUser,
  updateUser,
  detailsUser,
  listUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../../../common/core/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createUser);

router.put("/:id", updateUser);

router.get("/", listUser);

router.get("/:id", detailsUser);

router.delete("/delete/:id", deleteUser);

export default router;
