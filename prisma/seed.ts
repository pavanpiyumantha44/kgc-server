import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const encryptPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

const servicesData = [
  {
    name: "Tennis Courts",
    description: "Premium tennis court facilities with professional lighting and maintained surfaces.",
    type: "sport",
    details: [
      {
        providedService: "Tennis Court 1",
        description: "Hourly court booking",
        localCost: 1000,
        foreignCost: 20,
        isAvailable: true,
      },
      {
        providedService: "Tennis Court 2",
        description: "Hourly court booking",
        localCost: 1000,
        foreignCost: 20,
        isAvailable: true,
      },
      {
        providedService: "Tennis Court 3",
        description: "Hourly court booking",
        localCost: 2000,
        foreignCost: 40,
        isAvailable: true,
      },
    ],
  },
  {
    name: "Table Tennis",
    description: "Indoor table tennis with quality equipment and air-conditioned environment.",
    type: "sport",
    details: [
      {
        providedService: "Table 1",
        description: "Per hour booking",
        localCost: 1000,
        foreignCost: 18,
        isAvailable: true,
      },
      {
        providedService: "Table 2",
        description: "Per hour booking",
        localCost: 1000,
        foreignCost: 18,
        isAvailable: true,
      }
    ],
  },
  {
    name: "Snooker Table Booking",
    description: "Professional snooker tables with premium cloth and lighting.",
    type: "sport",
    details: [
      {
        providedService: "Snooker Table 1",
        description: "Premium table session",
        localCost: 3000,
        foreignCost: 30,
        isAvailable: true,
      },
      {
        providedService: "  Snooker Table 2",
        description: "Premium table session",
        localCost: 3000,
        foreignCost: 30,
        isAvailable: true,
      },
      {
        providedService: "Snooker Table 3",
        description: "Premium table session",
        localCost: 3000,
        foreignCost: 30,
        isAvailable: true,
      },
    ],
  },
  {
    name: "Coaching Sessions",
    description: "Professional coaching for tennis, table tennis, and snooker.",
    type: "service",
    details: [
      {
        providedService: "Private Coaching",
        description: "1-on-1 training for an hour",
        localCost: 3500,
        foreignCost: 40,
        isAvailable: true,
      },
    ],
  },
  {
    name: "Equipment Rental",
    description: "High-quality equipment rental for tennis, table tennis, and snooker.",
    type: "service",
    details: [
      {
        providedService: "Racket Rental",
        description: "2 Tennis Rackets & 3 Balls - Per Hour",
        localCost: 2000,
        foreignCost: 30,
        isAvailable: true,
      },
    ],
  },
  {
    name: "Flood Lights",
    description: "Floodlight rental for evening play on tennis courts.",
    type: "service",
    details: [
      {
        providedService: "Flood Light Rental",
        description: "Floodlight rental for an hour",
        localCost: 1000,
        foreignCost: 5,
        isAvailable: true,
      },
    ],
  },
];

async function seed(): Promise<void> {
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@gmail.com",
      phone: "08156786754",
      password: await encryptPassword("admin@123"),
    },
  });

  //const servicesData = [/* paste array above */];

  for (const service of servicesData) {
    await prisma.service.create({
      data: {
        name: service.name,
        description: service.description,
        type: service.type,
        serviceDetails: {
          create: service.details,
        },
      },
    });
  }
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
