import { Router } from "express";
import OrderController from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.post("/", OrderController.createOrder);
orderRouter.get("/:id", OrderController.getOrderById);
orderRouter.get("/store/:storeId", OrderController.getOrdersByStore);
orderRouter.get(
  "/status/:status/store/:storeId",
  OrderController.getOrderByStatus,
);
orderRouter.get(
  "/customer/:customerId/store/:storeId",
  OrderController.getOrderByCustomer,
);
orderRouter.put("/:id/status", OrderController.updateOrderStatus);

export default orderRouter;
