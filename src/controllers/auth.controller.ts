import { Response } from "express";
import Seller, { SellerPlan } from "../models/seller.model";
import catchAsync from "../utils/catchAsync";
import { generateOtp, saveOtp, verifyOtp } from "../utils/otp";
import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";

const AuthController = {
  getMe: catchAsync(async (req: any, res: Response) => {
    const user = await Seller.findByPk(req.user.id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.json(user);
  }),

  sendOtp: catchAsync(async (req: any, res: Response) => {
    const { phone } = req.body;

    if (!phone) {
      throw new AppError("Phone is required", 400);
    }

    let seller = await Seller.findOne({ where: { phone } });

    // 🔹 AUTO CREATE SELLER IF NOT FOUND
    if (!seller) {
      seller = await Seller.create({
        phone,
        status: 1,
        plan: SellerPlan.FREE,
      });
    }

    const otp = generateOtp();
    saveOtp(phone, otp);

    console.log(`OTP for ${phone}: ${otp}`); // TEMP (remove in prod)

    return res.json({
      message: "OTP sent successfully",
      isNewUser: !seller.email, // optional flag
    });
  }),

  verifyOtp: catchAsync(async (req: any, res: Response) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) throw new AppError("Phone and OTP are required", 400);

    const user = await Seller.findOne({ where: { phone } });
    if (!user) throw new AppError("Not Found", 404);

    const isValid = verifyOtp(phone, otp);
    if (!isValid) throw new AppError("Invalid OTP", 400);

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    // Set cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.json({ message: "OTP verified successfully" });
  }),

  logout: catchAsync(async (req: any, res: Response) => {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  }),
};

export default AuthController;
