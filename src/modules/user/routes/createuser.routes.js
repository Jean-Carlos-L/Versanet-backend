import express from "express";
import { UserController } from "../controllers/user.controller.js";

const router = express.Router();

// Endpoint para crear usuario
router.post("/users", UserController.createUser);

export default router;
