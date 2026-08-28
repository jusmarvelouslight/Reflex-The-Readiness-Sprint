import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware.js";

type Role = "RETAILER" | "DISPATCHER" | "RIDER";

export function requireRole(...allowedRoles: Role[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTHENTICATION_REQUIRED",
          message: "Authentication required"
        }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action"
        }
      });
    }

    next();
  };
}