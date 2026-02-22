import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const encryptPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

async function seed(): Promise<void> {
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@gmail.com",
      phone: "08156786754",
      password: await encryptPassword("admin@123"),
    },
  });

  await prisma.service.createMany({
    data: [
      {
        name: "Tennis Courts",
        description: "Premium tennis court facilities with professional lighting and maintained surfaces.",
      },
      {
        name: "Table Tennis",
        description: "Indoor table tennis with quality equipment and air-conditioned environment.",
      },
      {
        name: "Snooker Table Booking",
        description: "Professional snooker tables with premium cloth and lighting.",
      },
      {
        name: "Coaching Sessions",
        description: "Professional coaching for tennis, table tennis, and snooker.",
      },
      {
        name: "Equipment Rental",
        description: "High-quality equipment rental for tennis, table tennis, and snooker.",
      }
    ]
  });
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
