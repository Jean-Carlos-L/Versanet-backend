import express from "express";

import { getPlans, getPlanById } from "../controllers/plan.controller.js";
import { authMiddleware } from "../../../common/core/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getPlans);

router.get("/:id", getPlanById);

export default router;
