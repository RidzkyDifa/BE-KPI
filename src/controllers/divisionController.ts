import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const createDivision = async (req: Request, res: Response) => {
  try {
    const { name, description, weight } = req.body;

    // Kumpulkan semua error validasi dalam satu object
    const errors: { [key: string]: string[] } = {};

    // Cek apakah nama divisi valid (minimal 2 karakter)
    if (!name || name.trim().length < 2) {
      errors.name = ["Name must be at least 2 characters"];
    }

    // Cek apakah nama divisi sudah digunakan
    if (name && name.trim()) {
      const existingDivision = await prisma.division.findFirst({
        where: { name: name.trim() },
      });
      if (existingDivision) {
        errors.name = ["Division name already exists"];
      }
    }

    // Cek apakah weight bernilai positif (jika diisi)
    if (weight !== undefined && weight < 0) {
      errors.weight = ["Weight must be a positive number"];
    }

    // Jika ada error validasi, kirim response error
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        status: "error",
        code: 422,
        errors,
      });
    }

    // Buat divisi baru di database
    const newDivision = await prisma.division.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        weight: weight || null,
      },
    });

    // Kirim response sukses
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Division created successfully",
        division: newDivision,
      },
    });
  } catch (err) {
    // Tangani error yang tidak terduga
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

export const getAllDivisions = async (req: Request, res: Response) => {
  try {
    // Ambil parameter query dengan nilai default
    const {
      page = "1",
      limit = "10",
      search = "",
      includeEmployees = "false",
    } = req.query;

    // Konversi string ke number untuk pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    // Hitung berapa data yang dilewati untuk pagination
    const skip = (pageNum - 1) * limitNum;

    // Siapkan kondisi pencarian (where clause)
    const whereClause: any = {};

    // Jika ada keyword pencarian, cari di nama dan deskripsi
    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Siapkan data relasi yang akan diambil (include clause)
    const includeClause: any = {};
    if (includeEmployees === "true") {
      // Jika diminta, ambil detail karyawan beserta user dan posisinya
      includeClause.employees = {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          position: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      };
      // Hitung jumlah karyawan per divisi
      includeClause._count = { select: { employees: true } };
    } else {
      // Jika tidak diminta detail, hanya hitung jumlah karyawan
      includeClause._count = { select: { employees: true } };
    }

    // Jalankan query database secara parallel untuk performa
    const [divisions, totalCount] = await Promise.all([
      prisma.division.findMany({
        where: whereClause,
        include: includeClause,
        orderBy: [{ name: "asc" }],
        skip,
        take: limitNum,
      }),
      prisma.division.count({ where: whereClause }),
    ]);

    // Hitung total halaman berdasarkan jumlah data dan limit
    const totalPages = Math.ceil(totalCount / limitNum);

    // Kirim response dengan data dan informasi pagination
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        divisions,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (err) {
    // Tangani error yang tidak terduga
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

export const getDivisionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Cari divisi berdasarkan ID beserta semua data relasinya
    const division = await prisma.division.findUnique({
      where: { id },
      include: {
        employees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                verified: true,
              },
            },
            position: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
          orderBy: [{ user: { name: "asc" } }, { employeeNumber: "asc" }],
        },
        _count: { select: { employees: true } },
      },
    });

    // Jika divisi tidak ditemukan, kirim error 404
    if (!division) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          division: ["Division not found"],
        },
      });
    }

    // Kirim data divisi yang ditemukan
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        division,
      },
    });
  } catch (err) {
    // Tangani error yang tidak terduga
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

export const updateDivision = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, weight } = req.body;

    // Cek apakah divisi yang akan diupdate ada
    const existingDivision = await prisma.division.findUnique({
      where: { id },
    });

    if (!existingDivision) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          division: ["Division not found"],
        },
      });
    }

    // Kumpulkan semua error validasi
    const errors: { [key: string]: string[] } = {};

    // Validasi nama (jika dikirim)
    if (name !== undefined) {
      if (!name || name.trim().length < 2) {
        errors.name = ["Name must be at least 2 characters"];
      } else if (name.trim() !== existingDivision.name) {
        // Cek duplikat hanya jika nama berubah
        const duplicateDivision = await prisma.division.findFirst({
          where: { name: name.trim() },
        });
        if (duplicateDivision) {
          errors.name = ["Division name already exists"];
        }
      }
    }

    // Validasi weight (jika dikirim)
    if (weight !== undefined && weight < 0) {
      errors.weight = ["Weight must be a positive number"];
    }

    // Jika ada error validasi, kirim response error
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        status: "error",
        code: 422,
        errors,
      });
    }

    // Siapkan data yang akan diupdate (hanya field yang dikirim)
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || null;
    if (weight !== undefined) updateData.weight = weight;

    // Update divisi di database
    const updatedDivision = await prisma.division.update({
      where: { id },
      data: updateData,
      include: {
        _count: { select: { employees: true } },
      },
    });

    // Kirim response sukses dengan data yang sudah diupdate
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Division updated successfully",
        division: updatedDivision,
      },
    });
  } catch (err) {
    // Tangani error yang tidak terduga
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

export const deleteDivision = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Cari divisi beserta karyawan yang terhubung
    const division = await prisma.division.findUnique({
      where: { id },
      include: {
        employees: true,
      },
    });

    // Jika divisi tidak ditemukan
    if (!division) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          division: ["Division not found"],
        },
      });
    }

    // Cek apakah masih ada karyawan yang terhubung dengan divisi
    if (division.employees && division.employees.length > 0) {
      return res.status(409).json({
        status: "error",
        code: 409,
        errors: {
          division: [
            `Cannot delete division with existing employees (${division.employees.length} employees). Please reassign or remove employees first.`,
          ],
        },
      });
    }

    // Hapus divisi dari database
    await prisma.division.delete({
      where: { id },
    });

    // Kirim response sukses
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Division deleted successfully",
      },
    });
  } catch (err) {
    // Tangani error yang tidak terduga
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

/**
 * ===== .trim() METHOD EXPLANATION =====
 *
 * .trim() menghapus whitespace (spasi, tab, newline) di awal dan akhir string
 *
 * Contoh:
 * - Input user: "   Marketing Department   "
 * - Tanpa trim: "   Marketing Department   " (21 karakter)
 * - Dengan trim: "Marketing Department" (19 karakter)
 *
 * Kenapa perlu .trim()?
 * 1. User bisa tidak sengaja mengetik spasi
 * 2. Konsistensi data di database
 * 3. Validasi yang lebih akurat
 * 4. Mencegah duplikat yang tidak terdeteksi
 *
 * ===== DIVISION CONTROLLER DOCUMENTATION =====
 *
 * Controller untuk manajemen divisi perusahaan
 *
 * Endpoints:
 * POST   /api/divisions        - Buat divisi baru (Admin only)
 * GET    /api/divisions        - List divisi + pagination (User)
 * GET    /api/divisions/:id    - Detail divisi (User)
 * PUT    /api/divisions/:id    - Update divisi (Admin only)
 * DELETE /api/divisions/:id    - Hapus divisi (Admin only)
 *
 * Query Parameters (GET /api/divisions):
 * - page: 1              (halaman ke berapa)
 * - limit: 10            (jumlah data per halaman)
 * - search: ""           (cari di nama/deskripsi)
 * - includeEmployees: false (sertakan data karyawan atau tidak)
 *
 * Response Format:
 * Success: { status: "success", code: 200, data: {...} }
 * Error:   { status: "error", code: 4xx/5xx, errors: {...} }
 *
 * Error Codes:
 * 404 - Divisi tidak ditemukan
 * 409 - Tidak bisa hapus divisi yang masih punya karyawan
 * 422 - Validasi input gagal (nama duplikat, nama terlalu pendek, dll)
 */
