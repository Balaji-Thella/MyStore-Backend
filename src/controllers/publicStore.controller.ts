import { Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { Product, Store } from "../models";

const PublicStoreController = {
  getStoreBySlug: catchAsync(async (req: any, res: Response) => {
    const { slug } = req.params;

    if (!slug) throw new AppError("Store slug is required", 400);

    const store = await Store.findOne({
      where: {
        slug,
        status: 1, // active store only
      },
      attributes: ["id", "name", "slug", "logoUrl", "whatsappNumber", "upiId"],
      include: [
        {
          model: Product,
          as: "products",
          where: {
            status: 1, // active products only
          },
          required: false, // store can exist even if no products
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
        },
      ],
    });

    if (!store) throw new AppError("Store not found", 404);

    return res.status(200).json({
      success: true,
      data: store,
    });
  }),
};

export default PublicStoreController;
