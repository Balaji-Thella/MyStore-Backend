import { Router } from "express";
import CustomerController from "../controllers/customer.controller";

const customerRouter = Router();

customerRouter.post("/", CustomerController.checkCustomerCreateOrUpdate);
customerRouter.get("/store/:storeId", CustomerController.getCustomersByStore);

export default customerRouter;
