import { prisma } from "../config/database.js";

interface CreateDeliveryInput {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  itemDescription: string;
}

export async function createDelivery(
  input: CreateDeliveryInput,
  retailerId: string
) {
  const delivery = await prisma.delivery.create({
    data: {
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      deliveryAddress: input.deliveryAddress,
      itemDescription: input.itemDescription,
      retailerId
    }
  });

  await prisma.deliveryStatusHistory.create({
    data: {
      deliveryId: delivery.id,
      status: "PENDING",
      changedById: retailerId
    }
  });

  return delivery;
}

export async function getDeliveries(
  userId: string,
  role: "RETAILER" | "DISPATCHER" | "RIDER"
) {
  if (role === "RETAILER") {
    return prisma.delivery.findMany({
      where: {
        retailerId: userId
      },
      include: {
        rider: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  if (role === "RIDER") {
    return prisma.delivery.findMany({
      where: {
        riderId: userId
      },
      include: {
        retailer: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  return prisma.delivery.findMany({
    include: {
      retailer: {
        select: {
          id: true,
          name: true
        }
      },
      rider: {
        select: {
          id: true,
          name: true,
          phone: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

// 🛡️ 5.28 — Secured contextual delivery selection model
export async function getDeliveryById(
  deliveryId: string,
  userId: string,
  role: "RETAILER" | "DISPATCHER" | "RIDER"
) {
  const delivery = await prisma.delivery.findUnique({
    where: {
      id: deliveryId
    },
    include: {
      retailer: {
        select: {
          id: true,
          name: true,
          phone: true
        }
      },
      rider: {
        select: {
          id: true,
          name: true,
          phone: true
        }
      },
      history: {
        include: {
          changedBy: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });

  if (!delivery) {
    return null;
  }

  // Row-level ownership authorization validations
  if (role === "RETAILER" && delivery.retailerId !== userId) {
    throw new Error("FORBIDDEN");
  }

  if (role === "RIDER" && delivery.riderId !== userId) {
    throw new Error("FORBIDDEN");
  }

  return delivery;
}

export async function assignDelivery(
  deliveryId: string,
  riderId: string,
  dispatcherId: string
) {
  const rider = await prisma.user.findUnique({
    where: {
      id: riderId
    }
  });

  if (!rider || rider.role !== "RIDER") {
    throw new Error("INVALID_RIDER");
  }

  const delivery = await prisma.delivery.findUnique({
    where: {
      id: deliveryId
    }
  });

  if (!delivery) {
    throw new Error("DELIVERY_NOT_FOUND");
  }

  if (delivery.status !== "PENDING") {
    throw new Error("DELIVERY_NOT_ASSIGNABLE");
  }

  return prisma.$transaction(async (tx) => {
    const updatedDelivery = await tx.delivery.update({
      where: {
        id: deliveryId
      },
      data: {
        riderId,
        status: "ASSIGNED",
        assignedAt: new Date()
      }
    });

    await tx.deliveryStatusHistory.create({
      data: {
        deliveryId,
        status: "ASSIGNED",
        changedById: dispatcherId
      }
    });

    return updatedDelivery;
  });
}

export async function updateDeliveryStatus(
  deliveryId: string,
  riderId: string,
  newStatus: "PICKED_UP" | "DELIVERED" | "CANCELLED"
) {
  const delivery = await prisma.delivery.findUnique({
    where: {
      id: deliveryId
    }
  });

  if (!delivery) {
    throw new Error("DELIVERY_NOT_FOUND");
  }

  // Verify that only the assigned rider can update states
  if (delivery.riderId !== riderId) {
    throw new Error("UNAUTHORIZED_RIDER");
  }

  const validTransitions: Record<string, string[]> = {
    ASSIGNED: ["PICKED_UP", "CANCELLED"],
    PICKED_UP: ["DELIVERED", "CANCELLED"],
    DELIVERED: [],
    CANCELLED: []
  };

  if (!validTransitions[delivery.status]?.includes(newStatus)) {
    throw new Error("INVALID_STATUS_TRANSITION");
  }

  const timestamp = new Date();
  const data: {
    status: "PICKED_UP" | "DELIVERED" | "CANCELLED";
    pickedUpAt?: Date;
    deliveredAt?: Date;
  } = {
    status: newStatus
  };

  if (newStatus === "PICKED_UP") {
    data.pickedUpAt = timestamp;
  }

  if (newStatus === "DELIVERED") {
    data.deliveredAt = timestamp;
  }

  return prisma.$transaction(async (tx) => {
    const updatedDelivery = await tx.delivery.update({
      where: {
        id: deliveryId
      },
      data
    });

    await tx.deliveryStatusHistory.create({
      data: {
        deliveryId,
        status: newStatus,
        changedById: riderId
      }
    });

    return updatedDelivery;
  });
}
