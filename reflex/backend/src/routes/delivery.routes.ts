import { Router } from "express";

import {
  create,
  list,
  getOne,
  assign,
  updateStatus // Added updateStatus import
} from "../controller/delivery.controller.js";

import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { 
  createDeliverySchema,
  assignDeliverySchema,
  updateDeliveryStatusSchema // Added updateDeliveryStatusSchema import
} from "../schemas/delivery.schema.js";

const router = Router();

// 1. Retailer creates a delivery
router.post(
  "/",
  authenticate,
  requireRole("RETAILER"),
  validate(createDeliverySchema),
  create
);

// 2. Anyone logged in can list their contextual deliveries
router.get(
  "/",
  authenticate, // Note: no requireRole here, as implemented in step 5.10
  list
);

// 3. Anyone logged in can fetch a single delivery's detailed history screen
router.get(
  "/:id",
  authenticate,
  getOne
);

// 4. Dispatcher assigns a rider to a delivery
router.patch(
  "/:id/assign",
  authenticate,
  requireRole("DISPATCHER"),
  validate(assignDeliverySchema),
  assign
);

// 5. Rider updates delivery progress status (Added for 5.24)
router.patch(
  "/:id/status",
  authenticate,
  requireRole("RIDER"),
  validate(updateDeliveryStatusSchema),
  updateStatus
);

export default router;
