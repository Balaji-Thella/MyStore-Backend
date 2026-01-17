import { Response } from "express";
import Store from "../models/store.model";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import slugify from "slugify";

const StoreController = {
  createStore: catchAsync(async (req: any, res: Response) => {
    const user = req.user!;
    const { name, whatsappNumber, upiId, logoUrl } = req.body;

    if (!name || !whatsappNumber)
      throw new AppError("Missing required fields", 400);

    const slug = slugify(name, { lower: true, strict: true });

    const existing = await Store.findOne({ where: { slug } });
    if (existing) throw new AppError("Store name already exists", 409);

    const store = await Store.create({
      sellerId: user.id,
      name,
      slug,
      whatsappNumber,
      upiId,
      logoUrl,
    });

    return res.status(201).json(store);
  }),

  getMyStore: catchAsync(async (req: any, res: Response) => {
    const user = req.user!;

    const store = await Store.findAll({ where: { sellerId: user.id } });
    if (!store) throw new AppError("Store not found", 404);

    return res.json(store);
  }),

  getStoreById: catchAsync(async (req: any, res: Response) => {
    const { id } = req.params;

    const store = await Store.findByPk(id);
    if (!store) throw new AppError("Store not found", 404);

    return res.json(store);
  }),

  updateStore: catchAsync(async (req: any, res: Response) => {
    const user = req.user!;
    const { name, whatsappNumber, upiId, logoUrl } = req.body;
    const { id } = req.params;

    const store = await Store.findOne({ where: { id: id, sellerId: user.id } });
    if (!store) throw new AppError("Store not found", 404);

    if (name) {
      const slug = slugify(name, { lower: true, strict: true });
      const existing = await Store.findOne({ where: { slug } });
      if (existing && existing.id !== store.id)
        throw new AppError("Store name already exists", 409);
      store.name = name;
      store.slug = slug;
    }

    if (whatsappNumber) store.whatsappNumber = whatsappNumber;
    if (upiId !== undefined) store.upiId = upiId;
    if (logoUrl !== undefined) store.logoUrl = logoUrl;

    await store.save();

    return res.json(store);
  }),

  deleteStore: catchAsync(async (req: any, res: Response) => {
    const user = req.user!;
    const { id } = req.params;

    const store = await Store.findOne({ where: { id: id, sellerId: user.id } });
    if (!store) throw new AppError("Store not found", 404);

    await store.destroy();

    return res.status(204).send();
  }),
};

export default StoreController;
