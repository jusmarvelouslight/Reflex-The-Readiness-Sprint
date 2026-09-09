import dotenv from 'dotenv';
dotenv.config();

import { Role, DeliveryStatus } from '@prisma/client';
import { prisma } from './database.js';

async function main() {
  console.log('Clearing old data in strict relation order...');

  // 1. Delete history logs first (depends on Deliveries)
  await prisma.deliveryStatusHistory.deleteMany({});
  console.log('✔ History records cleared.');

  // 2. Delete deliveries next (depends on Users)
  await prisma.delivery.deleteMany({});
  console.log('✔ Delivery records cleared.');

  // 3. Delete users last (safely leaves no orphans)
  await prisma.user.deleteMany({});
  console.log('✔ User accounts cleared.');

  console.log('Seeding application users (Retailers & Riders)...');

  const retailer = await prisma.user.create({
    data: {
      name: 'Central Retailer Office',
      email: 'retail@reflex.com',
      passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyzA1B2C3D4E5F6G7H8I9J0K1L2M3N',
      role: Role.RETAILER,
    },
  });

  const kMwangi = await prisma.user.create({
    data: {
      name: 'Kevin Mwangi',
      email: 'kevin.mwangi@reflex.com',
      passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyzA1B2C3D4E5F6G7H8I9J0K1L2M3N',
      role: Role.RIDER,
    },
  });

  const bKamau = await prisma.user.create({
    data: {
      name: 'Brian Kamau',
      email: 'brian.kamau@reflex.com',
      passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyzA1B2C3D4E5F6G7H8I9J0K1L2M3N',
      role: Role.RIDER,
    },
  });

  const fNjeri = await prisma.user.create({
    data: {
      name: 'Faith Njeri',
      email: 'faith.njeri@reflex.com',
      passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyzA1B2C3D4E5F6G7H8I9J0K1L2M3N',
      role: Role.RIDER,
    },
  });

  const sKiptoo = await prisma.user.create({
    data: {
      name: 'Samuel Kiptoo',
      email: 'samuel.kiptoo@reflex.com',
      passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyzA1B2C3D4E5F6G7H8I9J0K1L2M3N',
      role: Role.RIDER,
    },
  });

  console.log('Seeding deliveries aligned with database rules...');

  await prisma.delivery.create({
    data: {
      id: 'RX-1048',
      referenceCode: 'RX-1048',
      customerName: 'Amara Wanjiku',
      customerPhone: '+254700000001',
      deliveryAddress: 'Westlands',
      itemDescription: 'Standard Document Parcel',
      status: DeliveryStatus.PICKED_UP,
      retailerId: retailer.id,
      riderId: kMwangi.id,
    },
  });

  await prisma.delivery.create({
    data: {
      id: 'RX-1047',
      referenceCode: 'RX-1047',
      customerName: 'Daniel Otieno',
      customerPhone: '+254700000002',
      deliveryAddress: 'Kilimani',
      itemDescription: 'Electronic Goods Box',
      status: DeliveryStatus.DELIVERED,
      retailerId: retailer.id,
      riderId: bKamau.id,
    },
  });

  await prisma.delivery.create({
    data: {
      id: 'RX-1046',
      referenceCode: 'RX-1046',
      customerName: 'Maya Shah',
      customerPhone: '+254700000003',
      deliveryAddress: 'Lavington',
      itemDescription: 'Food & Beverage Package',
      status: DeliveryStatus.ASSIGNED,
      retailerId: retailer.id,
      riderId: fNjeri.id,
    },
  });

  await prisma.delivery.create({
    data: {
      id: 'RX-1045',
      referenceCode: 'RX-1045',
      customerName: 'Brian Kamau',
      customerPhone: '+254700000004',
      deliveryAddress: 'Karen',
      itemDescription: 'E-commerce Apparel',
      status: DeliveryStatus.PENDING,
      retailerId: retailer.id,
      riderId: null,
    },
  });

  await prisma.delivery.create({
    data: {
      id: 'RX-1044',
      referenceCode: 'RX-1044',
      customerName: 'Aisha Hassan',
      customerPhone: '+254700000005',
      deliveryAddress: 'Parklands',
      itemDescription: 'Fragile Glassware Item',
      status: DeliveryStatus.CANCELLED,
      retailerId: retailer.id,
      riderId: sKiptoo.id,
    },
  });

  console.log('Database populated successfully!');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
