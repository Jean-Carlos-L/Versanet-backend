import express from "express";

import {
  createPlanCustomer,
  updatePlanCustomer,
  getPlansCustomers,
  getPlanCustomerById,
  disablePlan,
  enablePlan,
  getCountPlansCustomers,
  deletePlanCustomer,
} from "../controllers/planCustomer.controller.js";
import { authMiddleware } from "../../../common/core/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getPlansCustomers);

router.get("/count", getCountPlansCustomers);

router.get("/:id", getPlanCustomerById);

router.post("/", createPlanCustomer);

router.put("/:id", updatePlanCustomer);

router.put("/enable/:id", enablePlan);

router.put("/disable/:id", disablePlan);

router.delete("/delete/:id", deletePlanCustomer);

export default router;
