import express from "express";
import { createUser, updateUser, detailsUser, listUser, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", createUser);

router.put("/:id", updateUser);

router.get("/", listUser);

router.get("/:id", detailsUser);

router.delete("/delete/:id", deleteUser);

export default router;
