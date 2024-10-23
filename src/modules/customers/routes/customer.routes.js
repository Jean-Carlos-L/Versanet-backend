import express from "express";
import {
  createCustomer,
  updateCustomer,
  getCustomerById,
  getCustomers,
  deleteCustomer,
  getCustomersByFilter
} from "../controllers/costumer.controller.js";
import { authorize } from "../../../common/core/role.middleware.js";




const router = express.Router();

router.post("/", authorize(["/customers/create"]) , createCustomer);
router.put("/:id", authorize(["/customers/update"]),updateCustomer);
router.get("/filter", authorize(["/customers/view"]), getCustomersByFilter);
router.get("/:id",authorize(["/customers/view"]), getCustomerById);
router.get("/",authorize(["/customers/view"]),  getCustomers);
router.delete("/delete/:id" , authorize(["/customers/delete"]), deleteCustomer);


export default router;