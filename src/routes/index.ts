import { Router } from "express";
import { authSeller } from "../middleware/auth";
import authRouter from "./auth.routes";
import storeRouter from "./store.routes";
import productRouter from "./product.routes";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/store", authSeller, storeRouter);
mainRouter.use("/products", productRouter);

export default mainRouter;
