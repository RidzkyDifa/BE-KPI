import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const createParamsKPI = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const errors: { [key: string]: string[] } = {};

    // validasi
    if (!name) {
      errors.name = ["Name is required"];
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Input
    const newKPI = await prisma.kPI.create({
      data: {
        name,
      },
    });

    return res.status(201).json(newKPI);
  } catch (error: any) {
    console.error("Error creating KPI:", error);
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
};

export const updateParamsKPI = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const errors: { [key: string]: string[] } = {};
    // validasi
    if (!name) {
      errors.name = ["Name is required"];
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Input
    const updatedKPI = await prisma.kPI.update({
      where: { id },
      data: {
        name,
      },
    });
    return res.status(200).json(updatedKPI);
  } catch (error: any) {
    console.error("Error updating KPI:", error);
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
};

export const getAllParamsKPI = async (req: Request, res: Response) => {
  try {
    const kpis = await prisma.kPI.findMany();
    res.json(kpis);
  } catch (error: any) {
    console.error("Error fetching KPIs:", error);
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
};

export const deleteParamsKPI = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.kPI.findUnique({ where: { id } });
    if (!existing) {
      return res.status(400).json({ error: "KPI not found" });
    }
    await prisma.kPI.delete({ where: { id } });
    res.json({ message: "KPI deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting KPI:", error);
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
};
export const createKPI = async (req: Request, res: Response) => {
  try {
    const { employeeId, kpiId, weight, target, actual, period, createdBy } =
      req.body;

    const errors: { [key: string]: string[] } = {};

    // validasi
    if (!employeeId) {
      errors.employeeId = ["Employee ID is required"];
    }

    if (!kpiId) {
      errors.kpiId = ["KPI ID is required"];
    }

    if (weight === undefined || weight === null) {
      errors.weight = ["Weight is required"];
    }

    if (target === undefined || target === null) {
      errors.target = ["Target is required"];
    }

    if (actual === undefined || actual === null) {
      errors.actual = ["Actual is required"];
    }

    if (!period) {
      errors.period = ["Period is required"];
    }

    if (!createdBy) {
      errors.createdBy = ["Created By is required"];
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Hitung score dan achievement
    const score = (actual / target) * 100;
    const achievement = weight * score;

    // Input
    const newKPI = await prisma.employeeKPI.create({
      data: {
        employeeId,
        kpiId,
        weight,
        target,
        actual,
        score,
        achievement,
        period: new Date(period),
        createdBy,
      },
    });

    res.status(201).json({ message: "KPI created successfully", data: newKPI });
  } catch (error: any) {
    console.error("Error creating KPI:", error);
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
};

export const getKPIById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Ngambil data
    const kpi = await prisma.employeeKPI.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            division: true,
            position: true,
            user: true,
          },
        },
        kpi: true,
      },
    });

    //handel tidak ada data
    if (!kpi) {
      return res.status(400).json({ error: "KPI not found" });
    }

    res.json({ data: kpi });
  } catch (error: any) {
    console.error("Error fetching KPI by ID:", error);
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
};

export const updateKPI = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { weight, target, actual, period, updatedBy } = req.body;

    const errors: { [key: string]: string[] } = {};

    const existingKPI = await prisma.employeeKPI.findUnique({
      where: { id },
    });

    //validasi
    if (!existingKPI) {
      return res.status(404).json({ error: "KPI record not found" });
    }

    // cek ulang
    const score =
      actual !== undefined && target !== undefined
        ? (actual / target) * 100
        : existingKPI.score;
    const achievement =
      weight !== undefined ? weight * score : existingKPI.achievement;

    //udpate KPI
    const updatedKPI = await prisma.employeeKPI.update({
      where: { id },
      data: {
        weight: weight !== undefined ? weight : existingKPI.weight,
        target: target !== undefined ? target : existingKPI.target,
        actual: actual !== undefined ? actual : existingKPI.actual,
        score: score,
        achievement: achievement,
        period: period !== undefined ? new Date(period) : existingKPI.period,
        updatedBy: updatedBy !== undefined ? updatedBy : existingKPI.updatedBy,
      },
    });

    res
      .status(200)
      .json({ message: "KPI updated successfully", data: updatedKPI });
  } catch (error: any) {
    console.error("Error updating KPI:", error);
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
};

export const getKPIReport = async (req: Request, res: Response) => {
  try {
    const { employeeId, period } = req.query;

    // validasi
    if (!employeeId || !period) {
      return res
        .status(400)
        .json({ error: "Employee ID and Period are required" });
    }

    //Ngambil data
    const kpiReport = await prisma.employeeKPI.findMany({
      where: {
        employeeId: String(employeeId),
        period: new Date(period as string),
      },
      include: {
        employee: {
          include: {
            division: true,
            position: true,
            user: true,
          },
        },
        kpi: true,
      },
    });

    //handle no data
    if (kpiReport.length === 0) {
      return res
        .status(404)
        .json({ error: "No KPI data found for the given employee and period" });
    }

    //Format data
    const result = kpiReport.map((res) => ({
      id: res.id,
      namaKaryawan: res.employee.user?.name ?? "Not Available",
      divisi: res.employee.division?.name ?? "Not Available",
      posisi: res.employee.position?.name ?? "Not Available",
      KPI: res.kpi.name,
      score: res.score,
      achievement: res.achievement,
      tanggal: res.period,
    }));

    res.json({ data: result });
  } catch (error: any) {
    console.error("Error creating KPI:", error);
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
};

export const deleteKPI = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    //nyari data
    const existing = await prisma.employeeKPI.findUnique({ where: { id } });

    if (!existing) {
      return res.json(400).json({ data: "KPI not Found" });
    }

    await prisma.employeeKPI.delete({ where: { id } });

    res.json({ message: "KPI deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting KPI:", error);
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
};
