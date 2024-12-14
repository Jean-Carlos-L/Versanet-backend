import express from "express";
import { createInvoice } from "../controllers/invoice.controllers.js";
import { authMiddleware } from "../../../common/core/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/:id", createInvoice);

export default router;
