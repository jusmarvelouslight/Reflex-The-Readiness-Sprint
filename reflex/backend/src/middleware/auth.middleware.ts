import {
  Request,
  Response,
  NextFunction
} from "express";

import { verifyToken } from "../utils/jwt.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: "RETAILER" | "DISPATCHER" | "RIDER";
  };
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication token is required"
      }
    });
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      error: {
        code: "INVALID_AUTH_HEADER",
        message: "Use Bearer token authentication"
      }
    });
  }

  try {
    const payload = verifyToken(token);

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Invalid or expired authentication token"
      }
    });
  }
}