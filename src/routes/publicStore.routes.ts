import { Router } from "express";
import PublicStoreController from "../controllers/publicStore.controller";

const publicRouter = Router();

publicRouter.get(
  "/store/:slug/products",
  PublicStoreController.getStoreProductsBySlug,
);
publicRouter.get("/store/:slug", PublicStoreController.getStoreBySlug);

export default publicRouter;
