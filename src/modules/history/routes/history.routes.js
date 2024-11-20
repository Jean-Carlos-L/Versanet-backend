import express from "express";
import {
  getHistoryByEntity,
  getAllHistory,
  getHistoryById,
  countHistoryByEntity,
} from "../controllers/history.controller.js";
import { authMiddleware } from "../../../common/core/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllHistory); // Obtener todas las notificaciones
router.get("/:entity", getHistoryByEntity); // Obtener por entidad
router.get("/details/:id", getHistoryById); // Obtener por ID+
router.get("/count/:entity", countHistoryByEntity); // Obtener total por entidad

export default router;
