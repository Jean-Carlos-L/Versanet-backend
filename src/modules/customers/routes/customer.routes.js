import express from "express";
import {
  createCustomer,
  updateCustomer,
  detailsCustomer,
  listCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";
import { authorize } from "../../../common/core/role.middleware.js";

const router = express.Router();

router.post("/", authorize(["/customers/create"]), createCustomer);
router.put("/:id", authorize(["/customers/update"]), updateCustomer);
router.get("/", authorize(["/customers/view"]), listCustomer);
router.get("/:id", authorize(["/customers/view"]), detailsCustomer);
router.delete("/delete/:id", authorize(["/customers/delete"]), deleteCustomer);
router.put("/filter", authorize(["/customers/view"]), getCustomersByFilter);