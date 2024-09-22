import express from "express";
import { UserController } from "../controllers/user.controller.js";

const router = express.Router();

// Endpoint para listar usuarios con paginación y filtros
router.get("/users", UserController.listUsers);

export default router;
