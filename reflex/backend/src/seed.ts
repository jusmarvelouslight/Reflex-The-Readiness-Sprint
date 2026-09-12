import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "./config/database.js";

// Safe defaults for the Reflex operational/demo environment.
// Environment variables override these values when configured.
const DEFAULT_DISPATCHER_EMAIL = "dispatcher@reflex.test";
const DEFAULT_DISPATCHER_PASSWORD = "Reflex123!";
const DEFAULT_RIDER_EMAIL = "rider@reflex.test";
const DEFAULT_RIDER_PASSWORD = "Rider123!";

export async function seedDemoData() {
  const dispatcherEmail =
    process.env.DEMO_DISPATCHER_EMAIL || DEFAULT_DISPATCHER_EMAIL;
  const dispatcherPassword =
    process.env.DEMO_DISPATCHER_PASSWORD || DEFAULT_DISPATCHER_PASSWORD;
  const configuredRiderEmail =
    process.env.DEMO_RIDER_EMAIL || DEFAULT_RIDER_EMAIL;
  const riderPassword =
    process.env.DEMO_RIDER_PASSWORD || DEFAULT_RIDER_PASSWORD;

  // Keep the dispatcher account available and keep its credentials current,
  // but do not touch operational delivery/rider state here.
  const dispatcher = await prisma.user.upsert({
    where: { email: dispatcherEmail },
    update: {
      name: "Reflex Dispatcher",
      role: "DISPATCHER",
      passwordHash: await bcrypt.hash(dispatcherPassword, 12),
    },
    create: {
      name: "Reflex Dispatcher",
      email: dispatcherEmail,
      role: "DISPATCHER",
      passwordHash: await bcrypt.hash(dispatcherPassword, 12),
    },
    select: { id: true },
  });

  const riderPasswordHash = await bcrypt.hash(riderPassword, 12);

  const riderDefinitions = [
    {
      name: "Kevin Mwangi",
      email: configuredRiderEmail,
      area: "Westlands",
      availability: "ASSIGNED" as const,
    },
    {
      name: "Brian Kamau",
      email: "brian.kamau@reflex.test",
      area: "Kilimani",
      availability: "AVAILABLE" as const,
    },
    {
      name: "Faith Njeri",
      email: "faith.njeri@reflex.test",
      area: "Lavington",
      availability: "ASSIGNED" as const,
    },
    {
      name: "Samuel Kiptoo",
      email: "samuel.kiptoo@reflex.test",
      area: "Parklands",
      availability: "UNAVAILABLE" as const,
    },
  ];

  const riders = new Map<string, { id: string }>();

  for (const definition of riderDefinitions) {
    const existingRider = await prisma.user.findUnique({
      where: { email: definition.email },
      select: { id: true },
    });

    const rider = await prisma.user.upsert({
      where: { email: definition.email },
      update: {
        name: definition.name,
        role: "RIDER",
        passwordHash: riderPasswordHash,
        serviceArea: definition.area,
      },
      create: {
        name: definition.name,
        email: definition.email,
        role: "RIDER",
        passwordHash: riderPasswordHash,
        availability: definition.availability,
        serviceArea: definition.area,
      },
      select: { id: true },
    });

    riders.set(definition.name, rider);
    void existingRider;
  }

  const legacyRiderEmails = [
    "kevin.mwangi@reflex.com",
    "brian.kamau@reflex.com",
    "faith.njeri@reflex.com",
    "samuel.kiptoo@reflex.com",
  ];

  for (const legacyEmail of legacyRiderEmails) {
    const legacyRider = await prisma.user.findUnique({
      where: { email: legacyEmail },
      select: { id: true, name: true },
    });

    if (!legacyRider) continue;

    const canonicalRider = riders.get(legacyRider.name);
    if (!canonicalRider || canonicalRider.id === legacyRider.id) continue;

    await prisma.delivery.updateMany({
      where: { riderId: legacyRider.id },
      data: { riderId: canonicalRider.id },
    });

    await prisma.deliveryStatusHistory.updateMany({
      where: { changedById: legacyRider.id },
      data: { changedById: canonicalRider.id },
    });

    await prisma.user.delete({ where: { id: legacyRider.id } });
  }

  let retailer = await prisma.user.findUnique({
    where: { email: "retailer@reflex.test" },
    select: { id: true },
  });

  if (!retailer) {
    retailer = await prisma.user.create({
      data: {
        name: "Reflex Retailer",
        email: "retailer@reflex.test",
        role: "RETAILER",
        passwordHash: await bcrypt.hash(
          randomBytes(24).toString("hex"),
          12
        ),
      },
      select: { id: true },
    });
  }

  const legacyRetailer = await prisma.user.findUnique({
    where: { email: "retail@reflex.com" },
    select: { id: true },
  });

  if (legacyRetailer && legacyRetailer.id !== retailer.id) {
    await prisma.delivery.updateMany({
      where: { retailerId: legacyRetailer.id },
      data: { retailerId: retailer.id },
    });
    await prisma.user.delete({ where: { id: legacyRetailer.id } });
  }

  const deliveryDefinitions = [
    {
      referenceCode: "RX-1048",
      customerName: "Amara Wanjiku",
      customerPhone: "+254700000001",
      deliveryAddress: "Westlands, Nairobi",
      itemDescription: "Retail order",
      status: "ASSIGNED" as const,
      riderId: riders.get("Kevin Mwangi")!.id,
    },
    {
      referenceCode: "RX-1047",
      customerName: "Daniel Otieno",
      customerPhone: "+254700000002",
      deliveryAddress: "Kilimani, Nairobi",
      itemDescription: "Retail order",
      status: "PENDING" as const,
      riderId: null,
    },
    {
      referenceCode: "RX-1046",
      customerName: "Maya Shah",
      customerPhone: "+254700000003",
      deliveryAddress: "Lavington, Nairobi",
      itemDescription: "Retail order",
      status: "ASSIGNED" as const,
      riderId: riders.get("Faith Njeri")!.id,
    },
    {
      referenceCode: "RX-1044",
      customerName: "Aisha Hassan",
      customerPhone: "+254700000004",
      deliveryAddress: "Parklands, Nairobi",
      itemDescription: "Failed delivery",
      status: "CANCELLED" as const,
      riderId: null,
    },
  ];

  for (const definition of deliveryDefinitions) {
    const existingDelivery = await prisma.delivery.findUnique({
      where: { referenceCode: definition.referenceCode },
      select: {
        id: true,
        status: true,
        riderId: true,
      },
    });

    let delivery;

    if (existingDelivery) {
      delivery = await prisma.delivery.update({
        where: { id: existingDelivery.id },
        data: {
          customerName: definition.customerName,
          customerPhone: definition.customerPhone,
          deliveryAddress: definition.deliveryAddress,
          itemDescription: definition.itemDescription,
          retailerId: retailer.id,
        },
      });
    } else {
      delivery = await prisma.delivery.create({
        data: {
          referenceCode: definition.referenceCode,
          customerName: definition.customerName,
          customerPhone: definition.customerPhone,
          deliveryAddress: definition.deliveryAddress,
          itemDescription: definition.itemDescription,
          status: definition.status,
          retailerId: retailer.id,
          riderId: definition.riderId,
          assignedAt:
            definition.status === "ASSIGNED" ? new Date() : null,
        },
      });
    }

    const historyExists = await prisma.deliveryStatusHistory.findFirst({
      where: {
        deliveryId: delivery.id,
        status: delivery.status,
      },
      select: { id: true },
    });

    if (!historyExists) {
      const changedById =
        delivery.riderId && delivery.status !== "PENDING"
          ? delivery.riderId
          : dispatcher.id;

      await prisma.deliveryStatusHistory.create({
        data: {
          deliveryId: delivery.id,
          status: delivery.status,
          changedById,
        },
      });
    }
  }
}
