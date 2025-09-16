import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting admin seeding...");

  // --- Create Admin Users Only ---
  console.log("👤 Creating admin users...");

  // Admin 1
  const hashedPassword1 = await bcrypt.hash("admin123", 10);
  const admin1 = await prisma.user.upsert({
    where: { email: "admin1@gmail.com" },
    update: {},
    create: {
      id: "admin1-user",
      name: "Admin1",
      email: "admin1@gmail.com",
      password: hashedPassword1,
      role: "ADMIN",
      verified: true,
    },
  });

  // Admin 2
  const hashedPassword2 = await bcrypt.hash("admin123", 10);
  const admin2 = await prisma.user.upsert({
    where: { email: "admin2@gmail.com" },
    update: {},
    create: {
      id: "admin2-user",
      name: "Admin2",
      email: "admin2@gmail.com",
      password: hashedPassword2,
      role: "ADMIN",
      verified: true,
    },
  });

  console.log("✅ Admin seeding completed successfully!");
  console.log("\n📋 Summary:");
  console.log("- 2 Admin users created");
  console.log("\n🔑 Login credentials:");
  console.log("Admin1: admin1@gmail.com / admin123");
  console.log("Admin2: admin2@gmail.com / admin123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Admin seeding failed:", e);
    prisma.$disconnect();
    process.exit(1);
  });