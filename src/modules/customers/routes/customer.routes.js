import express from "express";
import {
  createCustomer,
  updateCustomer,
  getCustomerById,
  getCustomers,
  deleteCustomer,
  getCustomersByFilter
} from "../controllers/costumer.controller.js";




const router = express.Router();

router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.get("/filter", getCustomersByFilter);
router.get("/:id", getCustomerById);
router.get("/",   getCustomers);
router.delete("/delete/:id", deleteCustomer);


export default router;