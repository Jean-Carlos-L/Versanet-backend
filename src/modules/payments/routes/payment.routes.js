import express from "express";
import { createPayment } from "../controllers/payment.controller.js";
import { authMiddleware } from "../../../common/core/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);
router.post("/", createPayment);

export default router;
