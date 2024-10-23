import express from "express";

import {
  getPlansCustomers,
  disablePlan,
  enablePlan,
  getCountPlansCustomers,
} from "../controllers/planCustomer.controller.js";
import { authorize } from "../../../common/core/role.middleware.js";

const router = express.Router();

router.get("/", authorize(["/plans-customers/view"]), getPlansCustomers);

router.get("/count", getCountPlansCustomers);

router.put("/enable/:id", authorize(["/plans-customers/update"]), enablePlan);

router.put("/disable/:id", authorize(["/plans-customers/update"]), disablePlan);

export default router;
