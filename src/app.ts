import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mainRouter from "./routes";
import "./models";
import { sequelize } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

const allowedOrigins = ["http://localhost:3000"];

const isProd = process.env.NODE_ENV === "production";

// ---- CORS CONFIG ----
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("CORS blocked: Origin not allowed"));
    },
    credentials: true, // required for sending cookies
  })
);

// ---- GLOBAL HEADERS FOR COOKIES ----
app.use((req, res, next) => {
  if (allowedOrigins.includes(req.headers.origin as string)) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin as string);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// ---- MIDDLEWARES ----
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(isProd ? "combined" : "dev"));
app.use(cookieParser());

// ---- DB CONNECT ----
sequelize
  .authenticate()
  .then(() => console.log("MySQL Connected via Sequelize"))
  .catch((err) => console.error("DB Connection Error:", err));

// ---- ROUTES ----
app.use("/api", mainRouter);

// ---- HEALTH CHECK ----
app.get("/", (req, res) => res.send("My Store API running..."));

// ---- 404 HANDLER ----
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// ---- GLOBAL ERROR HANDLER ----
app.use(errorHandler);

export default app;
