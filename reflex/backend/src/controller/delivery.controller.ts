import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
createDelivery,
getDeliveries,
getDeliveryById,
assignDelivery,
updateDeliveryStatus
} from "../services/delivery.service.js"; 

// 1. Create a single delivery
export async function create(
req: AuthenticatedRequest,
res: Response,
next: NextFunction
) {
try {
const delivery = await createDelivery(
req.body,
req.user!.userId
); 

res.status(201).json({
success: true,
data: {
delivery
}
});
} catch (error) {
next(error);
}
} 

// 2. List deliveries filtered by role
export async function list(
req: AuthenticatedRequest,
res: Response,
next: NextFunction
) {
try {
const deliveries = await getDeliveries(
req.user!.userId,
req.user!.role
); 

res.status(200).json({
success: true,
data: {
deliveries
}
});
} catch (error) {
next(error);
}
} 

// 3. Get a single delivery with history (Fixed for 5.28 security)
export async function getOne(
req: AuthenticatedRequest,
res: Response,
next: NextFunction
) {
try {
// FIX: Added req.user!.role as the 3rd argument required by the service signature
const delivery = await getDeliveryById(
req.params.id as string,
req.user!.userId as string,
req.user!.role
); 

if (!delivery) {
return res.status(404).json({
success: false,
error: {
code: "DELIVERY_NOT_FOUND",
message: "Delivery not found"
}
});
}

return res.status(200).json({
success: true,
data: {
delivery
}
});

} catch (error) {
if (error instanceof Error && error.message === "FORBIDDEN") {
return res.status(403).json({
success: false,
error: {
code: "FORBIDDEN",
message: "You do not have access to this delivery"
}
});
} 

return next(error);
}
} 

// 4. Dispatcher assignment action
export async function assign(
req: AuthenticatedRequest,
res: Response,
next: NextFunction
) {
try {
const delivery = await assignDelivery(
req.params.id as string,
req.body.riderId,
req.user!.userId
); 

res.status(200).json({
success: true,
data: {
delivery
}
});
} catch (error) {
if (
error instanceof Error &&
error.message === "INVALID_RIDER"
) {
return res.status(400).json({
success: false,
error: {
code: "INVALID_RIDER",
message: "Selected user is not a valid rider"
}
});
} 

if (
error instanceof Error &&
error.message === "DELIVERY_NOT_FOUND"
) {
return res.status(404).json({
success: false,
error: {
code: "DELIVERY_NOT_FOUND",
message: "Delivery not found"
}
});
}

if (
error instanceof Error &&
error.message === "DELIVERY_NOT_ASSIGNABLE"
) {
return res.status(409).json({
success: false,
error: {
code: "DELIVERY_NOT_ASSIGNABLE",
message: "Only pending deliveries can be assigned"
}
});
}

next(error);

}
} 

// 5. Rider status update action
export async function updateStatus(
req: AuthenticatedRequest,
res: Response,
next: NextFunction
) {
try {
const delivery = await updateDeliveryStatus(
req.params.id as string,
req.user!.userId as string,
req.body.status as "PICKED_UP" | "DELIVERED" | "CANCELLED"
); 

return res.status(200).json({
success: true,
data: {
delivery
}
});
} catch (error) {
if (
error instanceof Error &&
error.message === "DELIVERY_NOT_FOUND"
) {
return res.status(404).json({
success: false,
error: {
code: "DELIVERY_NOT_FOUND",
message: "Delivery not found"
}
});
} 

if (
error instanceof Error &&
error.message === "UNAUTHORIZED_RIDER"
) {
return res.status(403).json({
success: false,
error: {
code: "UNAUTHORIZED_RIDER",
message: "You are not authorized to update this delivery"
}
});
}

if (
error instanceof Error &&
error.message === "INVALID_STATUS_TRANSITION"
) {
return res.status(400).json({
success: false,
error: {
code: "INVALID_STATUS_TRANSITION",
message: "Invalid delivery status transition sequence"
}
});
}

return next(error);

}
}