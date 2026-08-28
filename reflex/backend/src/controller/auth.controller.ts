import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser
} from "../services/auth.service.js";
import { prisma } from "../config/database.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "EMAIL_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        success: false,
        error: {
          code: "EMAIL_ALREADY_EXISTS",
          message: "A user with this email already exists"
        }
      });
    }

    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password"
        }
      });
    }

    next(error);
  }
}
export async function me(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found"
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
}