import { Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { Customer, Order, OrderItem, Product } from "../models";
import { sequelize } from "../config/db";

const OrderController = {
  createOrder: catchAsync(async (req: any, res: Response) => {
    const {
      customerId,
      storeId,
      items,
      totalAmount,
      paymentMode,
      paymentReference,
      status,
      deliveryNote,
    } = req.body;

    if (
      !customerId ||
      !storeId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !totalAmount ||
      !paymentMode
    ) {
      throw new AppError("Missing required fields", 400);
    }

    const orderNumber = `ORD-${Date.now()}`;

    const transaction = await sequelize.transaction();

    try {
      // Create Order
      const order = await Order.create(
        {
          storeId,
          customerId,
          orderNumber,
          totalAmount,
          paymentMode,
          paymentReference,
          status,
          deliveryNote,
        },
        { transaction },
      );

      // Validate Products in OrderItems
      const productIds = items.map((i) => i.productId);

      const products = await Product.findAll({
        where: { id: productIds, storeId },
      });

      if (products.length !== productIds.length) {
        throw new AppError("Invalid product(s) in order", 400);
      }

      // Prepare OrderItems
      const orderItemsPayload = items.map((item: any) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        priceTotal: item.price * item.quantity,
      }));

      // Create OrderItems
      await OrderItem.bulkCreate(orderItemsPayload, { transaction });

      // Commit if everything succeeds
      await transaction.commit();

      // Fetch order with items
      const orderWithItems = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: "items",
          },
        ],
      });

      return res.status(201).json(orderWithItems);
    } catch (error) {
      console.log("error on order place:", error);
      // Any error → rollback everything
      await transaction.rollback();
      throw error;
    }
  }),

  getOrderByStatus: catchAsync(async (req: any, res: Response) => {
    const { status, storeId } = req.params;
    const { page = 1, limit = 9 } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.max(Number(limit), 1);
    const offset = (pageNumber - 1) * pageSize;

    const { rows: orders, count } = await Order.findAndCountAll({
      where: {
        storeId,
        status,
      },
      limit: pageSize,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "products",
            },
          ],
        },
        {
          model: Customer,
          as: "customer",
        },
      ],
    });

    return res.json({
      data: orders,
      pagination: {
        total: count,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    });
  }),

  getOrdersByStore: catchAsync(async (req: any, res: Response) => {
    const { storeId } = req.params;
    const { page = 1, limit = 9 } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.max(Number(limit), 1);
    const offset = (pageNumber - 1) * pageSize;

    const { rows: orders, count } = await Order.findAndCountAll({
      where: {
        storeId,
      },
      limit: pageSize,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "products",
            },
          ],
        },
        {
          model: Customer,
          as: "customer",
        },
      ],
    });

    return res.json({
      data: orders,
      pagination: {
        total: count,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    });
  }),

  getOrderByCustomer: catchAsync(async (req: any, res: Response) => {
    const { customerId } = req.params;
    const { storeId } = req.query;

    if (!storeId)
      throw new AppError("storeId query parameter is required", 400);

    const orders = await Order.findAll({
      where: {
        storeId,
        customerId,
      },
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
    });

    return res.json(orders);
  }),

  updateOrderStatus: catchAsync(async (req: any, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) throw new AppError("Order not found", 404);

    order.status = status;
    if (status === "DELIVERED") {
      order.deliveredAt = new Date();
    }

    await order.save();
    return res.json(order);
  }),

  getOrderById: catchAsync(async (req: any, res: Response) => {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: "items" }],
    });
    if (!order) throw new AppError("Order not found", 404);

    return res.json(order);
  }),
};

export default OrderController;
