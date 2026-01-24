import { Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { Customer } from "../models";
import { Op } from "sequelize";

const CustomerController = {
  checkCustomerCreateOrUpdate: catchAsync(async (req: any, res: Response) => {
    const { storeId, name, email, phone, address } = req.body;
    if (!storeId || !name || !phone || !address)
      throw new AppError("Missing required fields", 400);

    let customer = await Customer.findOne({
      where: {
        storeId,
        phone,
      },
    });

    if (customer) {
      // Update existing customer
      customer.name = name || customer.name;
      customer.email = email || customer.email;
      customer.address = address || customer.address;
      await customer.save();
    } else {
      // Create new customer
      customer = await Customer.create({
        storeId,
        name,
        email,
        phone,
        address,
      });
    }

    return res.status(200).json(customer);
  }),

  getCustomersByStore: catchAsync(async (req: any, res: Response) => {
    const { storeId } = req.params;

    const customers = await Customer.findAll({ where: { storeId } });
    return res.json(customers);
  }),
};

export default CustomerController;
