import express from "express";

import { getPlans, getPlanById } from "../controllers/plan.controller.js";
import { authorize } from "../../../common/core/role.middleware.js";

const router = express.Router();

router.get("/", authorize(["/plans/view"]), getPlans);

router.get("/:id", authorize(["/plans/view"]), getPlanById);

export default router;
