import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader("Content-Type", "application/json");

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Something went wrong" : err.message;

  console.log("Error: ", err);

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
