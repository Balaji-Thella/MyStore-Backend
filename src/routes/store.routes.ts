import { Router } from "express";
import StoreController from "../controllers/store.controller";

const storeRouter = Router();

storeRouter.post("/", StoreController.createStore);
storeRouter.get("/", StoreController.getMyStore);
storeRouter.get("/:id", StoreController.getStoreById);
storeRouter.put("/:id", StoreController.updateStore);
storeRouter.delete("/:id", StoreController.deleteStore);

export default storeRouter;
