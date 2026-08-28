import { z } from "zod";

export const createDeliverySchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters")
    .max(100),

  customerPhone: z
    .string()
    .min(7, "Invalid phone number")
    .max(20),

  deliveryAddress: z
    .string()
    .min(3, "Delivery address is required")
    .max(255),

  itemDescription: z
    .string()
    .min(1, "Item description is required")
    .max(500)
});

export const assignDeliverySchema = z.object({
  riderId: z
    .string()
    .uuid("Invalid rider ID")
});

export const updateDeliveryStatusSchema = z.object({
  status: z.enum([
    "PICKED_UP",
    "DELIVERED",
    "CANCELLED"
  ])
});
