import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const createDivision = async (req: Request, res: Response) => {
  try {
    const { name, description, weight } = req.body;

    // Validasi input
    if (!name || name.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Name must be at least 3 characters" });
    }
    if (weight && weight < 0) {
      return res
        .status(400)
        .json({ message: "Weight must be a positive number" });
    }

    const newDivision = await prisma.division.create({
      data: { name, description, weight },
    });

    res.status(201).json({
      message: "Division created successfully",
      code: 201,
      division: newDivision,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      code: 500,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getAllDivisions = async (req: Request, res: Response) => {
  try {
    const divisions = await prisma.division.findMany({
      include: { employees: true }, // optional
    });
    res
      .status(200)
      .json({
        message: "Divisions retrieved successfully",
        code: 200,
        divisions,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      code: 500,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getDivisionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const division = await prisma.division.findUnique({
      where: { id },
      include: { employees: true }, // optional
    });

    if (!division)
      return res.status(404).json({ message: "Division not found", code: 404 });

    res
      .status(200)
      .json({
        message: "Division retrieved successfully",
        code: 200,
        division,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      code: 500,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const updateDivision = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, weight } = req.body;

    const existingDivision = await prisma.division.findUnique({
      where: { id },
    });
    if (!existingDivision)
      return res.status(404).json({ message: "Division not found", code: 404 });

    const updatedDivision = await prisma.division.update({
      where: { id },
      data: {
        name: name ?? existingDivision.name,
        description: description ?? existingDivision.description,
        weight: weight ?? existingDivision.weight,
      },
    });

    res
      .status(200)
      .json({
        message: "Division updated successfully",
        code: 200,
        division: updatedDivision,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      code: 500,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteDivision = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingDivision = await prisma.division.findUnique({
      where: { id },
    });
    if (!existingDivision)
      return res.status(404).json({ message: "Division not found", code: 404 });

    await prisma.division.delete({ where: { id } });

    res
      .status(200)
      .json({ message: "Division deleted successfully", code: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      code: 500,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
