import { Router } from "express";
import { prisma } from "../config/database.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      data: {
        service: "Reflex API",
        status: "healthy",
        database: "connected"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Database connection failed"
      }
    });
  }
});

export default router;
