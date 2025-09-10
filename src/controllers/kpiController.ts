import { Request, Response } from "express";
import prisma from "../utils/prisma";

// GET /api/kpis - Get all KPIs
export const getAllKPIs = async (req: Request, res: Response) => {
  try {
    const kpis = await prisma.KPI.findMany({
      include: {
        employeeKpis: {
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
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        kpis,
        total: kpis.length
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

// GET /api/kpis/:id - Get KPI by ID
export const getKPIById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const kpi = await prisma.KPI.findUnique({
      where: { id },
      include: {
        employeeKpis: {
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
            }
          },
          orderBy: {
            period: 'desc'
          }
        }
      }
    });

    if (!kpi) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          kpi: ["KPI not found"]
        }
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        kpi
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

// POST /api/kpis - Create new KPI
export const createKPI = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const errors: { [key: string]: string[] } = {};

    // Validate KPI name
    if (!name || name.trim().length < 2) {
      errors.name = ["Name must be at least 2 characters"];
    }

    // Check if KPI name already exists
    if (name && name.trim()) {
      const existingKPI = await prisma.KPI.findFirst({
        where: { name: name.trim() }
      });
      if (existingKPI) {
        errors.name = ["KPI name already exists"];
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

    // Create new KPI in database
    const newKPI = await prisma.KPI.create({
      data: {
        name: name.trim()
      }
    });

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "KPI created successfully",
        kpi: newKPI
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

// PUT /api/kpis/:id - Update KPI
export const updateKPI = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const errors: { [key: string]: string[] } = {};

    // Check if KPI exists
    const existingKPI = await prisma.KPI.findUnique({
      where: { id }
    });

    if (!existingKPI) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          kpi: ["KPI not found"]
        }
      });
    }

    // Validate KPI name
    if (!name || name.trim().length < 2) {
      errors.name = ["Name must be at least 2 characters"];
    }

    // Check if KPI name already exists (excluding current KPI)
    if (name && name.trim()) {
      const duplicateKPI = await prisma.KPI.findFirst({
        where: { 
          name: name.trim(),
          NOT: { id }
        }
      });
      if (duplicateKPI) {
        errors.name = ["KPI name already exists"];
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

    // Update KPI in database
    const updatedKPI = await prisma.KPI.update({
      where: { id },
      data: {
        name: name.trim()
      }
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "KPI updated successfully",
        kpi: updatedKPI
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

// DELETE /api/kpis/:id - Delete KPI
export const deleteKPI = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if KPI exists
    const existingKPI = await prisma.KPI.findUnique({
      where: { id },
      include: {
        employeeKpis: true
      }
    });

    if (!existingKPI) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          kpi: ["KPI not found"]
        }
      });
    }

    // Check if KPI has assessments
    if (existingKPI.employeeKpis.length > 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        errors: {
          kpi: ["Cannot delete KPI that has assessments associated with it"]
        }
      });
    }

    // Delete KPI from database
    await prisma.KPI.delete({
      where: { id }
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "KPI deleted successfully"
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