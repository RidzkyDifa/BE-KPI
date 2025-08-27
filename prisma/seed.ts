import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // buat hashing password

const prisma = new PrismaClient();

async function main() {
  // --- 1. Master Data ---
  const divisions = await prisma.division.createMany({
    data: [
      { name: "HR", description: "Human Resources", weight: 30 },
      { name: "IT", description: "Information Technology", weight: 40 },
      { name: "Finance", description: "Finance Department", weight: 30 },
    ],
    skipDuplicates: true, // kalau sudah ada, skip
  });

  const positions = await prisma.position.createMany({
    data: [
      { name: "Staff", description: "Staff level" },
      { name: "Manager", description: "Manager level" },
      { name: "Director", description: "Director level" },
    ],
    skipDuplicates: true,
  });

  const kpis = await prisma.kPI.createMany({
    data: [
      { name: "Attendance" },
      { name: "Teamwork" },
      { name: "Performance" },
    ],
    skipDuplicates: true,
  });

  // --- 2. Admin User ---
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {}, // kalau sudah ada, biarin
    create: {
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
      verified: true,
    },
  });

  console.log("✅ Seeding selesai!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
