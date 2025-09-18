import { Request, Response } from "express";
import prisma from "../utils/prisma";
import notificationService from "../services/notificationService";

// GET /api/reports/employee/:employeeId - Get employee performance report
export const getEmployeePerformanceReport = async (
  req: Request,
  res: Response
) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate, year, month } = req.query;

    // Build date filter
    let dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    } else if (year) {
      const yearNum = parseInt(year as string);
      if (month) {
        const monthNum = parseInt(month as string);
        dateFilter = {
          gte: new Date(yearNum, monthNum - 1, 1),
          lte: new Date(yearNum, monthNum, 0),
        };
      } else {
        dateFilter = {
          gte: new Date(yearNum, 0, 1),
          lte: new Date(yearNum, 11, 31),
        };
      }
    }

    // Get employee information
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        division: true,
        position: true,
      },
    });

    if (!employee) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          employee: ["Employee not found"],
        },
      });
    }

    // Get assessments
    const assessments = await prisma.employeeKPI.findMany({
      where: {
        employeeId,
        ...(Object.keys(dateFilter).length > 0 && { period: dateFilter }),
      },
      include: {
        kpi: true,
      },
      orderBy: {
        period: "desc",
      },
    });

    // Calculate performance metrics
    const totalAssessments = assessments.length;
    const totalAchievement = assessments.reduce(
      (sum, assessment) => sum + assessment.achievement,
      0
    );
    const averageAchievement =
      totalAssessments > 0 ? totalAchievement / totalAssessments : 0;
    const averageScore =
      totalAssessments > 0
        ? assessments.reduce((sum, assessment) => sum + assessment.score, 0) /
          totalAssessments
        : 0;

    // Group assessments by period for trend analysis
    const performanceByPeriod = assessments.reduce((acc: any, assessment) => {
      const periodKey = assessment.period.toISOString().substring(0, 7); // YYYY-MM format
      if (!acc[periodKey]) {
        acc[periodKey] = {
          period: periodKey,
          assessments: [],
          totalAchievement: 0,
          averageScore: 0,
        };
      }
      acc[periodKey].assessments.push(assessment);
      acc[periodKey].totalAchievement += assessment.achievement;
      return acc;
    }, {});

    // Calculate averages for each period
    Object.keys(performanceByPeriod).forEach((period) => {
      const periodData = performanceByPeriod[period];
      periodData.averageScore =
        periodData.assessments.reduce(
          (sum: number, assessment: any) => sum + assessment.score,
          0
        ) / periodData.assessments.length;
      
      // Format assessments for period
      periodData.assessments = periodData.assessments.map((assessment: any) => ({
        id: assessment.id,
        weight: assessment.weight,
        target: assessment.target,
        actual: assessment.actual,
        score: assessment.score,
        achievement: assessment.achievement,
        period: assessment.period,
        kpi: assessment.kpi
      }));
    });

    // Format main assessments
    const formattedAssessments = assessments.map(assessment => ({
      id: assessment.id,
      weight: assessment.weight,
      target: assessment.target,
      actual: assessment.actual,
      score: assessment.score,
      achievement: assessment.achievement,
      period: assessment.period,
      createdBy: assessment.createdBy,
      updatedBy: assessment.updatedBy,
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt,
      kpi: assessment.kpi
    }));

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        employee,
        summary: {
          totalAssessments,
          totalAchievement: Math.round(totalAchievement * 100) / 100,
          averageAchievement: Math.round(averageAchievement * 100) / 100,
          averageScore: Math.round(averageScore * 100) / 100,
        },
        assessments: formattedAssessments,
        performanceByPeriod: Object.values(performanceByPeriod),
      },
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage],
      },
    });
  }
};

// GET /api/reports/division/:divisionId - Get division performance report
export const getDivisionPerformanceReport = async (
  req: Request,
  res: Response
) => {
  try {
    const { divisionId } = req.params;
    const { startDate, endDate, year, month } = req.query;

    // Build date filter
    let dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    } else if (year) {
      const yearNum = parseInt(year as string);
      if (month) {
        const monthNum = parseInt(month as string);
        dateFilter = {
          gte: new Date(yearNum, monthNum - 1, 1),
          lte: new Date(yearNum, monthNum, 0),
        };
      } else {
        dateFilter = {
          gte: new Date(yearNum, 0, 1),
          lte: new Date(yearNum, 11, 31),
        };
      }
    }

    // Get division information
    const division = await prisma.division.findUnique({
      where: { id: divisionId },
      include: {
        employees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            position: true,
          },
        },
      },
    });

    if (!division) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          division: ["Division not found"],
        },
      });
    }

    // Get all assessments for employees in this division
    const employeeIds = division.employees.map((emp) => emp.id);
    const assessments = await prisma.employeeKPI.findMany({
      where: {
        employeeId: { in: employeeIds },
        ...(Object.keys(dateFilter).length > 0 && { period: dateFilter }),
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            position: true,
          },
        },
        kpi: true,
      },
      orderBy: {
        period: "desc",
      },
    });

    // Calculate division performance metrics
    const totalAssessments = assessments.length;
    const totalAchievement = assessments.reduce(
      (sum, assessment) => sum + assessment.achievement,
      0
    );
    const averageAchievement =
      totalAssessments > 0 ? totalAchievement / totalAssessments : 0;
    const averageScore =
      totalAssessments > 0
        ? assessments.reduce((sum, assessment) => sum + assessment.score, 0) /
          totalAssessments
        : 0;

    // Group performance by employee
    const performanceByEmployee = assessments.reduce((acc: any, assessment) => {
      const employeeId = assessment.employeeId;
      if (!acc[employeeId]) {
        acc[employeeId] = {
          employee: assessment.employee,
          assessments: [],
          totalAchievement: 0,
          averageScore: 0,
        };
      }
      acc[employeeId].assessments.push(assessment);
      acc[employeeId].totalAchievement += assessment.achievement;
      return acc;
    }, {});

    // Calculate averages for each employee
    Object.keys(performanceByEmployee).forEach((employeeId) => {
      const employeeData = performanceByEmployee[employeeId];
      employeeData.averageScore =
        employeeData.assessments.reduce(
          (sum: number, assessment: any) => sum + assessment.score,
          0
        ) / employeeData.assessments.length;
      employeeData.totalAchievement =
        Math.round(employeeData.totalAchievement * 100) / 100;
      employeeData.averageScore =
        Math.round(employeeData.averageScore * 100) / 100;
      
      // Format assessments for employee
      employeeData.assessments = employeeData.assessments.map((assessment: any) => ({
        id: assessment.id,
        weight: assessment.weight,
        target: assessment.target,
        actual: assessment.actual,
        score: assessment.score,
        achievement: assessment.achievement,
        period: assessment.period,
        kpi: assessment.kpi
      }));
    });

    const userIds = division.employees
      .filter((emp) => emp.user)
      .map((emp) => emp.user!.id);

    if (userIds.length > 0) {
      await notificationService.reportGenerated(
        userIds,
        `${year || "Tahun ini"}${month ? "-" + month : ""}`
      );
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        division,
        summary: {
          totalEmployees: division.employees.length,
          totalAssessments,
          totalAchievement: Math.round(totalAchievement * 100) / 100,
          averageAchievement: Math.round(averageAchievement * 100) / 100,
          averageScore: Math.round(averageScore * 100) / 100,
        },
        performanceByEmployee: Object.values(performanceByEmployee),
      },
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage],
      },
    });
  }
};

// GET /api/reports/kpi/:kpiId - Get KPI performance report
export const getKPIPerformanceReport = async (req: Request, res: Response) => {
  try {
    const { kpiId } = req.params;
    const { startDate, endDate, year, month } = req.query;

    // Build date filter
    let dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    } else if (year) {
      const yearNum = parseInt(year as string);
      if (month) {
        const monthNum = parseInt(month as string);
        dateFilter = {
          gte: new Date(yearNum, monthNum - 1, 1),
          lte: new Date(yearNum, monthNum, 0),
        };
      } else {
        dateFilter = {
          gte: new Date(yearNum, 0, 1),
          lte: new Date(yearNum, 11, 31),
        };
      }
    }

    // Get KPI information
    const kpi = await prisma.kPI.findUnique({
      where: { id: kpiId },
    });

    if (!kpi) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          kpi: ["KPI not found"],
        },
      });
    }

    // Get all assessments for this KPI
    const assessments = await prisma.employeeKPI.findMany({
      where: {
        kpiId,
        ...(Object.keys(dateFilter).length > 0 && { period: dateFilter }),
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            division: true,
            position: true,
          },
        },
      },
      orderBy: {
        period: "desc",
      },
    });

    // Calculate KPI performance metrics
    const totalAssessments = assessments.length;
    const totalAchievement = assessments.reduce(
      (sum, assessment) => sum + assessment.achievement,
      0
    );
    const averageAchievement =
      totalAssessments > 0 ? totalAchievement / totalAssessments : 0;
    const averageScore =
      totalAssessments > 0
        ? assessments.reduce((sum, assessment) => sum + assessment.score, 0) /
          totalAssessments
        : 0;

    // Find best and worst performers
    const sortedAssessments = [...assessments].sort(
      (a, b) => b.score - a.score
    );
    const bestPerformers = sortedAssessments.slice(0, 5);
    const worstPerformers = sortedAssessments.slice(-5);

    // Format best performers
    const formattedBestPerformers = bestPerformers.map(assessment => ({
      id: assessment.id,
      weight: assessment.weight,
      target: assessment.target,
      actual: assessment.actual,
      score: assessment.score,
      achievement: assessment.achievement,
      period: assessment.period,
      createdBy: assessment.createdBy,
      updatedBy: assessment.updatedBy,
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt,
      employee: assessment.employee
    }));

    // Format worst performers
    const formattedWorstPerformers = worstPerformers.map(assessment => ({
      id: assessment.id,
      weight: assessment.weight,
      target: assessment.target,
      actual: assessment.actual,
      score: assessment.score,
      achievement: assessment.achievement,
      period: assessment.period,
      createdBy: assessment.createdBy,
      updatedBy: assessment.updatedBy,
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt,
      employee: assessment.employee
    }));

    // Group by period for trend analysis
    const performanceByPeriod = assessments.reduce((acc: any, assessment) => {
      const periodKey = assessment.period.toISOString().substring(0, 7);
      if (!acc[periodKey]) {
        acc[periodKey] = {
          period: periodKey,
          assessments: [],
          totalAchievement: 0,
          averageScore: 0,
          employeeCount: 0,
        };
      }
      acc[periodKey].assessments.push(assessment);
      acc[periodKey].totalAchievement += assessment.achievement;
      acc[periodKey].employeeCount += 1;
      return acc;
    }, {});

    // Calculate averages for each period
    Object.keys(performanceByPeriod).forEach((period) => {
      const periodData = performanceByPeriod[period];
      periodData.averageScore =
        periodData.assessments.reduce(
          (sum: number, assessment: any) => sum + assessment.score,
          0
        ) / periodData.assessments.length;
      periodData.totalAchievement =
        Math.round(periodData.totalAchievement * 100) / 100;
      periodData.averageScore = Math.round(periodData.averageScore * 100) / 100;
      
      // Format assessments for period
      periodData.assessments = periodData.assessments.map((assessment: any) => ({
        weight: assessment.weight,
        target: assessment.target,
        actual: assessment.actual,
        score: assessment.score,
        achievement: assessment.achievement
      }));
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        kpi,
        summary: {
          totalAssessments,
          totalAchievement: Math.round(totalAchievement * 100) / 100,
          averageAchievement: Math.round(averageAchievement * 100) / 100,
          averageScore: Math.round(averageScore * 100) / 100,
        },
        bestPerformers: formattedBestPerformers,
        worstPerformers: formattedWorstPerformers,
        performanceByPeriod: Object.values(performanceByPeriod),
      },
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage],
      },
    });
  }
};

// GET /api/reports/dashboard - Get dashboard overview
export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;

    // Build date filter for current period
    let currentPeriodFilter: any = {};
    const currentDate = new Date();

    if (year && month) {
      const yearNum = parseInt(year as string);
      const monthNum = parseInt(month as string);
      currentPeriodFilter = {
        gte: new Date(yearNum, monthNum - 1, 1),
        lte: new Date(yearNum, monthNum, 0),
      };
    } else {
      // Default to current month
      currentPeriodFilter = {
        gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        lte: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
      };
    }

    // Get basic counts
    const [totalEmployees, totalDivisions, totalKPIs, totalAssessments] =
      await Promise.all([
        prisma.employee.count(),
        prisma.division.count(),
        prisma.kPI.count(),
        prisma.employeeKPI.count({
          where: { period: currentPeriodFilter },
        }),
      ]);

    // Get current period assessments
    const currentAssessments = await prisma.employeeKPI.findMany({
      where: { period: currentPeriodFilter },
      include: {
        employee: {
          include: {
            user: { select: { name: true } },
            division: true,
            position: true,
          },
        },
        kpi: true,
      },
    });

    // Calculate overall performance
    const overallAchievement =
      currentAssessments.length > 0
        ? currentAssessments.reduce(
            (sum, assessment) => sum + assessment.achievement,
            0
          ) / currentAssessments.length
        : 0;
    const overallScore =
      currentAssessments.length > 0
        ? currentAssessments.reduce(
            (sum, assessment) => sum + assessment.score,
            0
          ) / currentAssessments.length
        : 0;

    // Top performers - format with all fields
    const topPerformersRaw = currentAssessments
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const topPerformers = topPerformersRaw.map(assessment => ({
      id: assessment.id,
      weight: assessment.weight,
      target: assessment.target,
      actual: assessment.actual,
      score: assessment.score,
      achievement: assessment.achievement,
      period: assessment.period,
      createdBy: assessment.createdBy,
      updatedBy: assessment.updatedBy,
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt,
      employee: assessment.employee,
      kpi: assessment.kpi
    }));

    // Performance by division
    const divisionPerformance = currentAssessments.reduce(
      (acc: any, assessment) => {
        const divisionId = assessment.employee.division?.id;
        const divisionName =
          assessment.employee.division?.name || "No Division";

        if (!acc[divisionId || "none"]) {
          acc[divisionId || "none"] = {
            divisionId,
            divisionName,
            assessmentCount: 0,
            totalScore: 0,
            totalAchievement: 0,
          };
        }

        acc[divisionId || "none"].assessmentCount += 1;
        acc[divisionId || "none"].totalScore += assessment.score;
        acc[divisionId || "none"].totalAchievement += assessment.achievement;

        return acc;
      },
      {}
    );

    // Calculate averages for divisions
    Object.values(divisionPerformance).forEach((division: any) => {
      division.averageScore =
        Math.round((division.totalScore / division.assessmentCount) * 100) /
        100;
      division.averageAchievement =
        Math.round(
          (division.totalAchievement / division.assessmentCount) * 100
        ) / 100;
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        overview: {
          totalEmployees,
          totalDivisions,
          totalKPIs,
          totalAssessments,
          overallAchievement: Math.round(overallAchievement * 100) / 100,
          overallScore: Math.round(overallScore * 100) / 100,
        },
        topPerformers,
        divisionPerformance: Object.values(divisionPerformance),
      },
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage],
      },
    });
  }
};