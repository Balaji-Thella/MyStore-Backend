import { Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { Product, Store } from "../models";
import { Op } from "sequelize";

const PublicStoreController = {
  getStoreProductsBySlug: catchAsync(async (req: any, res: Response) => {
    const { slug } = req.params;
    const { page = 1, limit = 9, search = "" } = req.query;
    console.log("HIT getStoreProductsBySlug", req.params, req.query);

    if (!slug) throw new AppError("Store slug is required", 400);

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.max(Number(limit), 1);
    const offset = (pageNumber - 1) * pageSize;

    // 1️⃣ Fetch store
    const store = await Store.findOne({
      where: {
        slug,
        status: 1,
      },
      attributes: ["id", "name", "slug", "logoUrl", "whatsappNumber", "upiId"],
    });

    if (!store) throw new AppError("Store not found", 404);

    // 2️⃣ Fetch paginated products
    const { rows: products, count } = await Product.findAndCountAll({
      where: {
        storeId: store.id,
        status: 1,
        ...(search && {
          name: {
            [Op.iLike]: `%${search}%`, // use Op.like for MySQL
          },
        }),
      },
      attributes: [
        "id",
        "name",
        "price",
        "quantity",
        "description",
        "slug",
        "imageUrl",
      ],
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset,
    });

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize),
        hasMore: offset + products.length < count,
      },
    });
  }),

  getStoreBySlug: catchAsync(async (req: any, res: Response) => {
    const { slug } = req.params;

    if (!slug) throw new AppError("Store slug is required", 400);

    const store = await Store.findOne({
      where: {
        slug,
        status: 1, // active store only
      },
      attributes: ["id", "name", "slug", "logoUrl", "whatsappNumber", "upiId"],
    });

    if (!store) throw new AppError("Store not found", 404);

    return res.status(200).json({
      success: true,
      data: store,
    });
  }),
};

export default PublicStoreController;
