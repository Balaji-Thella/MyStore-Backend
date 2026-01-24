import { Response } from "express";
import { Product, Store } from "../models";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import slugify from "slugify";

const ProductsController = {
  createProduct: catchAsync(async (req: any, res: Response) => {
    const { storeId, name, description, price, quantity, imageUrl } = req.body;

    if (!storeId || !name || !price)
      throw new AppError("Missing required fields", 400);

    const store = await Store.findOne({
      where: { id: storeId, sellerId: req.user!.id },
    });
    if (!store) throw new AppError("Store not found", 404);

    const slug = slugify(name, { lower: true, strict: true });

    const existing = await Product.findOne({ where: { storeId, slug } });
    if (existing) throw new AppError("Product with same name exists", 409);

    const product = await Product.create({
      storeId,
      name,
      slug,
      description,
      price,
      quantity,
      imageUrl,
    });

    return res.status(201).json(product);
  }),

  getProductsByStore: catchAsync(async (req: any, res: Response) => {
    const { storeId } = req.params;

    const products = await Product.findAll({ where: { storeId } });
    return res.json(products);
  }),

  getProductById: catchAsync(async (req: any, res: Response) => {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) throw new AppError("Product not found", 404);

    return res.json(product);
  }),

  updateProduct: catchAsync(async (req: any, res: Response) => {
    const { id } = req.params;
    const { name, description, price, quantity, imageUrl, status } = req.body;

    const product = await Product.findByPk(id, {
      include: {
        model: Store,
        as: "store",
        where: { sellerId: req.user!.id },
      },
    });
    if (!product) throw new AppError("Product not found", 404);

    if (name) {
      const slug = slugify(name, { lower: true, strict: true });
      const existing = await Product.findOne({
        where: { storeId: product.storeId, slug, id: { $ne: id } },
      });
      if (existing) throw new AppError("Product with same name exists", 409);
      product.name = name;
      product.slug = slug;
    }

    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (status !== undefined) product.status = status;

    await product.save();

    return res.json(product);
  }),

  deleteProduct: catchAsync(async (req: any, res: Response) => {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: {
        model: Store,
        as: "store",
        where: { sellerId: req.user!.id },
      },
    });
    if (!product) throw new AppError("Product not found", 404);

    await product.destroy();

    return res.status(204).send();
  }),
};

export default ProductsController;
