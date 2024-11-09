import express from "express";
import { getStats } from "../controllers/stats.controller.js";
import { authMiddleware } from "../../../common/core/auth.middleware.js";

const router = express.Router();

//router.use(authMiddleware);

router.get("/", getStats);

export const statsRoutes = router;
