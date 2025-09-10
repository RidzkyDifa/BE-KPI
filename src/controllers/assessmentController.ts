import { Request, Response } from "express";
import prisma from "../utils/prisma";

// GET /api/assessments - Get all assessments with filters
export const getAllAssessments = async (req: Request, res: Response) => {
  try {
    const { employeeId, kpiId, period, startDate, endDate } = req.query;

    // Build where clause for filtering
    const whereClause: any = {};
    
    if (employeeId) whereClause.employeeId = employeeId as string;
    if (kpiId) whereClause.kpiId = kpiId as string;
    if (period) whereClause.period = new Date(period as string);
    
    if (startDate && endDate) {
      whereClause.period = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const assessments = await prisma.employeeKPI.findMany({
      where: whereClause,
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            division: true,
            position: true
          }
        },
        kpi: true
      },
      orderBy: [
        { period: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        assessments,
        total: assessments.length
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage]
      }
    });
  }
};

// GET /api/assessments/:id - Get assessment by ID
export const getAssessmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const assessment = await prisma.employeeKPI.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            division: true,
            position: true
          }
        },
        kpi: true
      }
    });

    if (!assessment) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          assessment: ["Assessment not found"]
        }
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        assessment
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage]
      }
    });
  }
};

// POST /api/assessments - Create new assessment
export const createAssessment = async (req: Request, res: Response) => {
  try {
    const { employeeId, kpiId, weight, target, actual, period } = req.body;
    const userId = req.user?.id; // From auth middleware

    const errors: { [key: string]: string[] } = {};

    // Validate required fields
    if (!employeeId) errors.employeeId = ["Employee ID is required"];
    if (!kpiId) errors.kpiId = ["KPI ID is required"];
    if (!weight || weight <= 0 || weight > 100) {
      errors.weight = ["Weight must be between 0.1 and 100"];
    }
    if (!target || target <= 0) errors.target = ["Target must be greater than 0"];
    if (actual === undefined || actual < 0) errors.actual = ["Actual value must be 0 or greater"];
    if (!period) errors.period = ["Period is required"];

    // Check if employee exists
    if (employeeId) {
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId }
      });
      if (!employee) {
        errors.employeeId = ["Employee not found"];
      }
    }

    // Check if KPI exists
    if (kpiId) {
      const kpi = await prisma.kPI.findUnique({
        where: { id: kpiId }
      });
      if (!kpi) {
        errors.kpiId = ["KPI not found"];
      }
    }

    // Check for duplicate assessment (same employee, KPI, and period)
    if (employeeId && kpiId && period) {
      const existingAssessment = await prisma.employeeKPI.findUnique({
        where: {
          employeeId_kpiId_period: {
            employeeId,
            kpiId,
            period: new Date(period)
          }
        }
      });
      if (existingAssessment) {
        errors.assessment = ["Assessment for this employee, KPI, and period already exists"];
      }
    }

    // If there are validation errors, return error response
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        status: "error",
        code: 422,
        errors
      });
    }

    // Calculate score and achievement
    const score = (actual / target) * 100;
    const achievement = (weight / 100) * score;

    // Create new assessment in database
    const newAssessment = await prisma.employeeKPI.create({
      data: {
        employeeId,
        kpiId,
        weight: parseFloat(weight.toString()),
        target: parseFloat(target.toString()),
        actual: parseFloat(actual.toString()),
        score,
        achievement,
        period: new Date(period),
        createdBy: userId
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            division: true,
            position: true
          }
        },
        kpi: true
      }
    });

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Assessment created successfully",
        assessment: newAssessment
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage]
      }
    });
  }
};

// PUT /api/assessments/:id - Update assessment
export const updateAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { weight, target, actual } = req.body;
    const userId = req.user?.id; // From auth middleware

    const errors: { [key: string]: string[] } = {};

    // Check if assessment exists
    const existingAssessment = await prisma.employeeKPI.findUnique({
      where: { id }
    });

    if (!existingAssessment) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          assessment: ["Assessment not found"]
        }
      });
    }

    // Validate fields if provided
    if (weight !== undefined && (weight <= 0 || weight > 100)) {
      errors.weight = ["Weight must be between 0.1 and 100"];
    }
    if (target !== undefined && target <= 0) {
      errors.target = ["Target must be greater than 0"];
    }
    if (actual !== undefined && actual < 0) {
      errors.actual = ["Actual value must be 0 or greater"];
    }

    // If there are validation errors, return error response
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        status: "error",
        code: 422,
        errors
      });
    }

    // Prepare update data
    const updateData: any = {
      updatedBy: userId
    };

    if (weight !== undefined) updateData.weight = parseFloat(weight.toString());
    if (target !== undefined) updateData.target = parseFloat(target.toString());
    if (actual !== undefined) updateData.actual = parseFloat(actual.toString());

    // Recalculate score and achievement if target or actual changed
    const finalWeight = updateData.weight !== undefined ? updateData.weight : existingAssessment.weight;
    const finalTarget = updateData.target !== undefined ? updateData.target : existingAssessment.target;
    const finalActual = updateData.actual !== undefined ? updateData.actual : existingAssessment.actual;

    updateData.score = (finalActual / finalTarget) * 100;
    updateData.achievement = (finalWeight / 100) * updateData.score;

    // Update assessment in database
    const updatedAssessment = await prisma.employeeKPI.update({
      where: { id },
      data: updateData,
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            division: true,
            position: true
          }
        },
        kpi: true
      }
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Assessment updated successfully",
        assessment: updatedAssessment
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage]
      }
    });
  }
};

// DELETE /api/assessments/:id - Delete assessment
export const deleteAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if assessment exists
    const existingAssessment = await prisma.employeeKPI.findUnique({
      where: { id }
    });

    if (!existingAssessment) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          assessment: ["Assessment not found"]
        }
      });
    }

    // Delete assessment from database
    await prisma.employeeKPI.delete({
      where: { id }
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Assessment deleted successfully"
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage]
      }
    });
  }
};

// GET /api/assessments/employee/:employeeId - Get assessments by employee
export const getAssessmentsByEmployee = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const { period, startDate, endDate } = req.query;

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (!employee) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          employee: ["Employee not found"]
        }
      });
    }

    // Build where clause
    const whereClause: any = { employeeId };
    
    if (period) whereClause.period = new Date(period as string);
    if (startDate && endDate) {
      whereClause.period = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const assessments = await prisma.employeeKPI.findMany({
      where: whereClause,
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            division: true,
            position: true
          }
        },
        kpi: true
      },
      orderBy: [
        { period: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Calculate summary statistics
    const totalAssessments = assessments.length;
    const totalScore = assessments.reduce((sum, assessment) => sum + assessment.score, 0);
    const averageScore = totalAssessments > 0 ? totalScore / totalAssessments : 0;
    const totalAchievement = assessments.reduce((sum, assessment) => sum + assessment.achievement, 0);

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        employee: {
          id: employee.id,
          employeeNumber: employee.employeeNumber,
          pnosNumber: employee.pnosNumber,
          dateJoined: employee.dateJoined
        },
        assessments,
        summary: {
          totalAssessments,
          averageScore: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
          totalAchievement: Math.round(totalAchievement * 100) / 100
        }
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage]
      }
    });
  }
};