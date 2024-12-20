import express from "express";
import {
  createInvoice,
  countInvoices,
  getInvoices,
} from "../controllers/invoice.controllers.js";
import { authMiddleware } from "../../../common/core/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/:id", createInvoice);
router.get("/", getInvoices);
router.get("/count", countInvoices);

export default router;
