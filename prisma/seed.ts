import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding...");

  // --- 1. Master Data - Divisions ---
  console.log("📁 Creating divisions...");
  const hrDiv = await prisma.division.upsert({
    where: { name: "HR" },
    update: {},
    create: { name: "HR", description: "Human Resources Department", weight: 25 }
  });

  const itDiv = await prisma.division.upsert({
    where: { name: "IT" },
    update: {},
    create: { name: "IT", description: "Information Technology Department", weight: 30 }
  });

  const financeDiv = await prisma.division.upsert({
    where: { name: "Finance" },
    update: {},
    create: { name: "Finance", description: "Finance Department", weight: 25 }
  });

  const marketingDiv = await prisma.division.upsert({
    where: { name: "Marketing" },
    update: {},
    create: { name: "Marketing", description: "Marketing Department", weight: 20 }
  });

  // --- 2. Master Data - Positions ---
  console.log("💼 Creating positions...");
  const staffPos = await prisma.position.upsert({
    where: { id: "staff-pos" },
    update: {},
    create: { 
      id: "staff-pos",
      name: "Staff", 
      description: "Staff level position" 
    }
  });

  const seniorPos = await prisma.position.upsert({
    where: { id: "senior-pos" },
    update: {},
    create: { 
      id: "senior-pos",
      name: "Senior Staff", 
      description: "Senior staff level position" 
    }
  });

  const managerPos = await prisma.position.upsert({
    where: { id: "manager-pos" },
    update: {},
    create: { 
      id: "manager-pos",
      name: "Manager", 
      description: "Manager level position" 
    }
  });

  const directorPos = await prisma.position.upsert({
    where: { id: "director-pos" },
    update: {},
    create: { 
      id: "director-pos",
      name: "Director", 
      description: "Director level position" 
    }
  });

  // --- 3. Master Data - KPIs ---
  console.log("📊 Creating KPIs...");
  const attendanceKPI = await prisma.kPI.upsert({
    where: { id: "attendance-kpi" },
    update: {},
    create: { 
      id: "attendance-kpi",
      name: "Attendance Rate" 
    }
  });

  const performanceKPI = await prisma.kPI.upsert({
    where: { id: "performance-kpi" },
    update: {},
    create: { 
      id: "performance-kpi",
      name: "Job Performance" 
    }
  });

  const teamworkKPI = await prisma.kPI.upsert({
    where: { id: "teamwork-kpi" },
    update: {},
    create: { 
      id: "teamwork-kpi",
      name: "Teamwork & Collaboration" 
    }
  });

  const innovationKPI = await prisma.kPI.upsert({
    where: { id: "innovation-kpi" },
    update: {},
    create: { 
      id: "innovation-kpi",
      name: "Innovation & Creativity" 
    }
  });

  // --- 4. Admin User ---
  console.log("👤 Creating admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@company.com" },
    update: {},
    create: {
      id: "admin-user",
      name: "System Administrator",
      email: "admin@company.com",
      password: hashedPassword,
      role: "ADMIN",
      verified: true,
    },
  });

  // --- 5. Sample Employees with Users ---
  console.log("👥 Creating employees...");

  // Employee 1 - HR Manager
  const hrUser = await prisma.user.upsert({
    where: { email: "andi.dea1@company.com" },
    update: {},
    create: {
      id: "hr-user",
      name: "Andi Dea1",
      email: "andi.dea1@company.com",
      password: await bcrypt.hash("password123", 10),
      role: "USER",
      verified: true,
    }
  });

  const hrEmployee = await prisma.employee.upsert({
    where: { id: "hr-employee" },
    update: {},
    create: {
      id: "hr-employee",
      employeeNumber: "EMP001",
      pnosNumber: "PNOS001",
      dateJoined: new Date("2020-01-15"),
      positionId: managerPos.id,
      divisionId: hrDiv.id,
    }
  });

  // Link user to employee
  await prisma.user.update({
    where: { id: hrUser.id },
    data: { employeeId: hrEmployee.id }
  });

  // Employee 2 - IT Staff
  const itUser = await prisma.user.upsert({
    where: { email: "andi.dea2@company.com" },
    update: {},
    create: {
      id: "it-user",
      name: "Andi Dea2",
      email: "andi.dea2@company.com",
      password: await bcrypt.hash("password123", 10),
      role: "USER",
      verified: true,
    }
  });

  const itEmployee = await prisma.employee.upsert({
    where: { id: "it-employee" },
    update: {},
    create: {
      id: "it-employee",
      employeeNumber: "EMP002",
      pnosNumber: "PNOS002",
      dateJoined: new Date("2021-03-01"),
      positionId: seniorPos.id,
      divisionId: itDiv.id,
    }
  });

  await prisma.user.update({
    where: { id: itUser.id },
    data: { employeeId: itEmployee.id }
  });

  // Employee 3 - Finance Staff
  const financeUser = await prisma.user.upsert({
    where: { email: "andi.dea3@company.com" },
    update: {},
    create: {
      id: "finance-user",
      name: "Andi Dea3",
      email: "andi.dea3@company.com",
      password: await bcrypt.hash("password123", 10),
      role: "USER",
      verified: true,
    }
  });

  const financeEmployee = await prisma.employee.upsert({
    where: { id: "finance-employee" },
    update: {},
    create: {
      id: "finance-employee",
      employeeNumber: "EMP003",
      pnosNumber: "PNOS003",
      dateJoined: new Date("2021-07-15"),
      positionId: staffPos.id,
      divisionId: financeDiv.id,
    }
  });

  await prisma.user.update({
    where: { id: financeUser.id },
    data: { employeeId: financeEmployee.id }
  });

  // Employee 4 - Marketing Manager
  const marketingUser = await prisma.user.upsert({
    where: { email: "andi.dea4@company.com" },
    update: {},
    create: {
      id: "marketing-user",
      name: "Andi Dea4",
      email: "andi.dea4@company.com",
      password: await bcrypt.hash("password123", 10),
      role: "USER",
      verified: true,
    }
  });

  const marketingEmployee = await prisma.employee.upsert({
    where: { id: "marketing-employee" },
    update: {},
    create: {
      id: "marketing-employee",
      employeeNumber: "EMP004",
      dateJoined: new Date("2019-11-01"),
      positionId: managerPos.id,
      divisionId: marketingDiv.id,
    }
  });

  await prisma.user.update({
    where: { id: marketingUser.id },
    data: { employeeId: marketingEmployee.id }
  });

  // --- 6. Sample Assessment Data ---
  console.log("📈 Creating sample assessments...");

  // Generate assessments for the last 3 months
  const currentDate = new Date();
  const months = [
    new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1), // 2 months ago
    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1), // 1 month ago
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),     // current month
  ];

  const employees = [hrEmployee, itEmployee, financeEmployee, marketingEmployee];
  const kpis = [attendanceKPI, performanceKPI, teamworkKPI, innovationKPI];

  for (const month of months) {
    for (const employee of employees) {
      for (const kpi of kpis) {
        // Generate random but realistic assessment data
        const weight = Math.floor(Math.random() * 20) + 20; // 20-40%
        const target = Math.floor(Math.random() * 20) + 80;  // 80-100
        const actual = Math.floor(Math.random() * 30) + 70;  // 70-100
        const score = (actual / target) * 100;
        const achievement = (weight / 100) * score;

        const assessmentId = `${employee.id}-${kpi.id}-${month.getFullYear()}-${month.getMonth()}`;
        
        await prisma.employeeKPI.upsert({
          where: {
            employeeId_kpiId_period: {
              employeeId: employee.id,
              kpiId: kpi.id,
              period: month
            }
          },
          update: {},
          create: {
            id: assessmentId,
            employeeId: employee.id,
            kpiId: kpi.id,
            weight,
            target,
            actual,
            score,
            achievement,
            period: month,
            createdBy: admin.id
          }
        });
      }
    }
  }

  console.log("✅ Seeding completed successfully!");
  console.log("\n📋 Summary:");
  console.log("- 4 Divisions created");
  console.log("- 4 Positions created");
  console.log("- 4 KPIs created");
  console.log("- 1 Admin user created");
  console.log("- 4 Employees with user accounts created");
  console.log("- Sample assessments for last 3 months created");
  console.log("\n🔑 Login credentials:");
  console.log("Admin: admin@company.com / admin123");
  console.log("HR Manager: andi.dea1@company.com / password123");
  console.log("IT Staff: andi.dea2@company.com / password123");
  console.log("Finance Staff: andi.dea3@company.com / password123");
  console.log("Marketing Manager: andi.dea4@company.com / password123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    prisma.$disconnect();
    process.exit(1);
  });