import { Router } from "express";
import { authSeller } from "../middleware/auth";
import authRouter from "./auth.routes";
import storeRouter from "./store.routes";
import productRouter from "./product.routes";
import publicRouter from "./publicStore.routes";
import customerRouter from "./customer.routes";
import orderRouter from "./order.routes";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/store", authSeller, storeRouter);
mainRouter.use("/products", productRouter);
mainRouter.use("/public", publicRouter);
mainRouter.use("/customers", customerRouter);
mainRouter.use("/orders", orderRouter);

export default mainRouter;
