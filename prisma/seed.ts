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
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
