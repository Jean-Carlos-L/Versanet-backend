import express from "express";
import { createInvoice } from "../controllers/invoice.controllers.js";

const router = express.Router();

router.post("/:id", createInvoice);

export default router;
