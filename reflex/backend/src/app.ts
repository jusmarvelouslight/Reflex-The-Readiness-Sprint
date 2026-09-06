import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";

import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

const allowedOrigins = (
  process.env.FRONTEND_URL || ""
)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(
          "Origin not allowed by Reflex CORS policy."
        )
      );
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      service: "reflex-backend",
    },
  });
});

app.use(
  "/api/v1/deliveries",
  deliveryRoutes
);

app.use(
  "/api/v1/health",
  healthRoutes
);

app.use(
  "/api/v1/auth",
  authRoutes
);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;