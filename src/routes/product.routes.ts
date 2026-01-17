import { Router } from "express";
import { authSeller } from "../middleware/auth";
import ProductsController from "../controllers/products.controller";

const productRouter = Router();

productRouter.get("/store/:storeId", ProductsController.getProductsByStore);

productRouter.post("/", authSeller, ProductsController.createProduct);
productRouter.put("/:id", authSeller, ProductsController.updateProduct);
productRouter.delete("/:id", authSeller, ProductsController.deleteProduct);
productRouter.get("/:id", authSeller, ProductsController.getProductById);

export default productRouter;
