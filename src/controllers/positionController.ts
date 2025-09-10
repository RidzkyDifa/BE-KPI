import { Request, Response } from "express";
import prisma from "../utils/prisma";

// GET /api/positions - Get all positions
export const getAllPositions = async (req: Request, res: Response) => {
  try {
    const positions = await prisma.position.findMany({
      include: {
        employees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
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
        positions,
        total: positions.length
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

// GET /api/positions/:id - Get position by ID
export const getPositionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const position = await prisma.position.findUnique({
      where: { id },
      include: {
        employees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            division: true
          }
        }
      }
    });

    if (!position) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          position: ["Position not found"]
        }
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        position
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

// POST /api/positions - Create new position
export const createPosition = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const errors: { [key: string]: string[] } = {};

    // Validate position name
    if (!name || name.trim().length < 2) {
      errors.name = ["Name must be at least 2 characters"];
    }

    // Check if position name already exists
    if (name && name.trim()) {
      const existingPosition = await prisma.position.findFirst({
        where: { name: name.trim() }
      });
      if (existingPosition) {
        errors.name = ["Position name already exists"];
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

    // Create new position in database
    const newPosition = await prisma.position.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null
      }
    });

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Position created successfully",
        position: newPosition
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

// PUT /api/positions/:id - Update position
export const updatePosition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const errors: { [key: string]: string[] } = {};

    // Check if position exists
    const existingPosition = await prisma.position.findUnique({
      where: { id }
    });

    if (!existingPosition) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          position: ["Position not found"]
        }
      });
    }

    // Validate position name
    if (!name || name.trim().length < 2) {
      errors.name = ["Name must be at least 2 characters"];
    }

    // Check if position name already exists (excluding current position)
    if (name && name.trim()) {
      const duplicatePosition = await prisma.position.findFirst({
        where: { 
          name: name.trim(),
          NOT: { id }
        }
      });
      if (duplicatePosition) {
        errors.name = ["Position name already exists"];
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

    // Update position in database
    const updatedPosition = await prisma.position.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null
      }
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Position updated successfully",
        position: updatedPosition
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

// DELETE /api/positions/:id - Delete position
export const deletePosition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if position exists
    const existingPosition = await prisma.position.findUnique({
      where: { id },
      include: {
        employees: true
      }
    });

    if (!existingPosition) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          position: ["Position not found"]
        }
      });
    }

    // Check if position has employees
    if (existingPosition.employees.length > 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        errors: {
          position: ["Cannot delete position that has employees assigned to it"]
        }
      });
    }

    // Delete position from database
    await prisma.position.delete({
      where: { id }
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Position deleted successfully"
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