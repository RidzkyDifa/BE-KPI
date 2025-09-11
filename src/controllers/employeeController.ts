import { Request, Response } from "express";
import prisma from "../utils/prisma";
import notificationService from "../services/notificationService";

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const {
      employeeNumber,
      pnosNumber,
      dateJoined,
      positionId,
      divisionId,
      userId,
    } = req.body;

    // Validasi input
    const errors: { [key: string]: string[] } = {};

    // Cek employee number duplikat (jika ada)
    if (employeeNumber) {
      const existingEmployee = await prisma.employee.findUnique({
        where: { employeeNumber },
      });
      if (existingEmployee) {
        errors.employeeNumber = ["Employee number already exists"];
      }
    }

    // Validasi position exists (optional berdasarkan schema)
    if (positionId) {
      const position = await prisma.position.findUnique({
        where: { id: positionId },
      });
      if (!position) {
        errors.positionId = ["Position not found"];
      }
    }

    // Validasi division exists (optional berdasarkan schema)
    if (divisionId) {
      const division = await prisma.division.findUnique({
        where: { id: divisionId },
      });
      if (!division) {
        errors.divisionId = ["Division not found"];
      }
    }

    // Validasi user untuk linking (optional)
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        errors.userId = ["User not found"];
      } else if (user.employeeId) {
        errors.userId = ["User already linked to another employee"];
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        status: "error",
        code: 422,
        errors,
      });
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        employeeNumber,
        pnosNumber,
        dateJoined: dateJoined ? new Date(dateJoined) : null,
        positionId: positionId || null, // set ke null jika tidak ada posisi yang dimasukan
        divisionId: divisionId || null, // set ke null jika tidak ada divisi yang dimasukan
      },
      include: {
        position: true,
        division: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Link employee ke user jika ada
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { employeeId: employee.id },
      });

      // Refresh data employee dengan user yang sudah dilink
      const updatedEmployee = await prisma.employee.findUnique({
        where: { id: employee.id },
        include: {
          position: true,
          division: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      // setelah employee berhasil dibuat & (opsional) link ke user
      const displayName =
        updatedEmployee?.user?.name ||
        employee.employeeNumber ||
        "Karyawan Baru";

      // notifikasi ke admin
      await notificationService.employeeCreated(displayName);

      return res.status(201).json({
        status: "success",
        code: 201,
        data: {
          message: "Employee created successfully",
          employee: updatedEmployee,
        },
      });
    }

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Employee created successfully",
        employee,
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

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    // Ambil query params dengan default value
    // page & limit = untuk pagination
    // search = untuk pencarian keyword
    // divisionId & positionId = untuk filter by relasi
    const {
      page = "1",
      limit = "10",
      search = "",
      divisionId = "",
      positionId = "",
    } = req.query;

    // Convert query param string → number
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    // Hitung berapa data yang dilewati (skip) untuk pagination
    const skip = (pageNum - 1) * limitNum;

    // Build where clause untuk filtering dinamis
    // Mulai dengan object kosong, isi sesuai kondisi
    const whereClause: any = {};

    // Jika user mengirim search keyword
    // Pakai mode insestive untuk mengabaikan besar kecil huruf
    if (search) {
      whereClause.OR = [
        // Cari data dengan employee number
        { employeeNumber: { contains: search as string, mode: "insensitive" } },
        // Cari data dengan PNOS number
        { pnosNumber: { contains: search as string, mode: "insensitive" } },
        // Cari data dengan nama user (jika employee terhubung dengan user)
        {
          user: {
            name: { contains: search as string, mode: "insensitive" },
          },
        },
      ];
    }

    // Jika ada filter divisionId → tambahkan ke whereClause
    if (divisionId) {
      whereClause.divisionId = divisionId as string;
    }

    // Jika ada filter positionId → tambahkan ke whereClause
    if (positionId) {
      whereClause.positionId = positionId as string;
    }

    // Query ke DB dilakukan paralel:
    // 1) Ambil list employees dengan filter, pagination, dan relasi
    // 2) Hitung total employees untuk kebutuhan pagination
    const [employees, totalCount] = await Promise.all([
      prisma.employee.findMany({
        where: whereClause, // Filternya dimasukan kesini
        include: {
          position: {
            select: { id: true, name: true, description: true },
          },
          division: {
            select: { id: true, name: true, description: true, weight: true },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              verified: true,
            },
          },
          // Hitung berapa KPI yang dimiliki tiap employee
          _count: { select: { employeeKpis: true } },
        },
        orderBy: [
          // Urutkan data: pertama berdasarkan nama user (asc),
          // lalu berdasarkan employeeNumber (asc)
          { user: { name: "asc" } },
          { employeeNumber: "asc" },
        ],
        skip, // Skip untuk pagination
        take: limitNum, // Ambil sesuai limit
      }),

      // Hitung total data untuk kebutuhan pagination
      prisma.employee.count({ where: whereClause }),
    ]);

    // Hitung total halaman berdasarkan jumlah data & limit
    const totalPages = Math.ceil(totalCount / limitNum);

    // Kirim response sukses ke client
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        employees, // hasil query employee
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum,
          hasNext: pageNum < totalPages, // ada halaman berikutnya?
          hasPrev: pageNum > 1, // ada halaman sebelumnya?
        },
      },
    });
  } catch (err) {
    // Tangkap error tak terduga & kirim sebagai 500 Internal Server Error
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

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        position: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        division: {
          select: {
            id: true,
            name: true,
            description: true,
            weight: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            verified: true,
            createdAt: true,
          },
        },
        employeeKpis: {
          include: {
            kpi: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { period: "desc" },
          take: 12, // 12 bulan terakhir
        },
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

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        employee,
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

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { employeeNumber, pnosNumber, dateJoined, positionId, divisionId } =
      req.body;

    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          employee: ["Employee not found"],
        },
      });
    }

    // Validasi input
    const errors: { [key: string]: string[] } = {};

    // Cek employee number duplikat (kecuali employee saat ini)
    if (employeeNumber && employeeNumber !== existingEmployee.employeeNumber) {
      const duplicateEmployee = await prisma.employee.findUnique({
        where: { employeeNumber },
      });
      if (duplicateEmployee) {
        errors.employeeNumber = ["Employee number already exists"];
      }
    }

    // Validasi position exists (jika diberikan)
    if (positionId) {
      const position = await prisma.position.findUnique({
        where: { id: positionId },
      });
      if (!position) {
        errors.positionId = ["Position not found"];
      }
    }

    // Validasi division exists (jika diberikan)
    if (divisionId) {
      const division = await prisma.division.findUnique({
        where: { id: divisionId },
      });
      if (!division) {
        errors.divisionId = ["Division not found"];
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        status: "error",
        code: 422,
        errors,
      });
    }

    // Build update data (hanya field yang ada)
    const updateData: any = {};
    // ⬆️ Siapkan object kosong untuk menampung field yang mau diupdate.
    //    Kenapa kosong dulu? Karena tidak semua field pasti dikirim user.

    if (employeeNumber !== undefined)
      updateData.employeeNumber = employeeNumber;
    // ⬆️ Kalau user mengirim employeeNumber, masukkan ke updateData.
    //    Kalau tidak dikirim, biarkan kosong (tidak diupdate).

    if (pnosNumber !== undefined) updateData.pnosNumber = pnosNumber;
    // ⬆️ Sama seperti di atas, tapi untuk field pnosNumber.

    if (dateJoined !== undefined)
      updateData.dateJoined = dateJoined ? new Date(dateJoined) : null;
    // ⬆️ Kalau user kirim dateJoined:
    //       - Jika ada nilainya → konversi ke objek Date (supaya format valid untuk DB).
    //       - Jika kosong/null → simpan null (hapus tanggal).
    //    Kalau user tidak kirim sama sekali → field ini tidak disentuh.

    if (positionId !== undefined) updateData.positionId = positionId;
    // ⬆️ Update positionId hanya jika dikirim.

    if (divisionId !== undefined) updateData.divisionId = divisionId;
    // ⬆️ Update divisionId hanya jika dikirim.

    const updatedEmployee = await prisma.employee.update({
      where: { id }, // Tentukan employee mana yang mau diupdate (berdasarkan id)
      data: updateData, // Field-field yang dikumpulkan di atas
      include: {
        position: true,
        division: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Employee updated successfully",
        employee: updatedEmployee,
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

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        user: true,
        employeeKpis: true,
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

    // PENTING: Berdasarkan schema, employeeKpis akan auto-delete karena onDelete: Cascade
    // PENTING: Tapi lebih baik warning user jika ada KPI records
    if (employee.employeeKpis && employee.employeeKpis.length > 0) {
      return res.status(409).json({
        status: "error",
        code: 409,
        errors: {
          employee: [
            `Cannot delete employee with existing KPI records (${employee.employeeKpis.length} records). All KPI data will be permanently deleted. Use with caution.`,
          ],
        },
      });
    }

    // Unlink dari user jika ada
    if (employee.user) {
      await prisma.user.update({
        where: { id: employee.user.id },
        data: { employeeId: null },
      });
    }

    // Delete employee - KPI akan auto-delete karena Cascade
    // PENTING: Tapi diblok sama kode diatas, jadi yang punya KPI gak bisa sampai disini
    await prisma.employee.delete({
      where: { id },
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Employee deleted successfully",
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

export const linkEmployeeToUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // employee ID
    const { userId } = req.body;

    // Validasi employee exists
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { user: true },
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

    // Validasi user exists dan belum dilink
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          user: ["User not found"],
        },
      });
    }

    if (user.employeeId) {
      return res.status(400).json({
        status: "error",
        code: 400,
        errors: {
          user: ["User already linked to another employee"],
        },
      });
    }

    if (employee.user) {
      return res.status(400).json({
        status: "error",
        code: 400,
        errors: {
          employee: ["Employee already linked to a user"],
        },
      });
    }

    // Link user to employee
    await prisma.user.update({
      where: { id: userId },
      data: { employeeId: id },
    });

    // Get updated employee data
    const updatedEmployee = await prisma.employee.findUnique({
      where: { id },
      include: {
        position: true,
        division: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            verified: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Employee linked to user successfully",
        employee: updatedEmployee,
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

export const unlinkEmployeeFromUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // employee ID

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { user: true },
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

    if (!employee.user) {
      return res.status(400).json({
        status: "error",
        code: 400,
        errors: {
          employee: ["Employee is not linked to any user"],
        },
      });
    }

    // Unlink user from employee
    await prisma.user.update({
      where: { id: employee.user.id },
      data: { employeeId: null },
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Employee unlinked from user successfully",
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

/**
 * ⚡️ Saran kecil:
 *
 * 1. Consistency error code (SUDAH DILAKUKAN)
 *    - deleteEmployee kalau masih ada KPI → sekarang pakai 400.
 *    - Lebih semantik kalau pakai 409 Conflict (karena ada relasi data yang menghalangi delete).
 *    - Jadi front-end bisa bedain mana error input vs konflik data.
 *
 * 2. Validation empty string
 *    - Di updateEmployee & createEmployee, kalau user kirim "" (string kosong), bakal ke-set ke DB.
 *    - Bisa ditambah check:
 *        if (employeeNumber?.trim() === "") {
 *          errors.employeeNumber = ["Employee number cannot be empty"];
 *        }
 *    - Jadi aman dari "kosong tapi bukan null".
 *
 * 3. Centralized error handler (optional)
 *    - Sekarang semua try/catch ada duplikat `err instanceof Error ? err.message : ...`.
 *    - Bisa diextract jadi middleware `errorHandler`, biar tiap controller lebih clean.
 *
 * 4. Atomic unlink + delete
 *    - Di deleteEmployee, sekarang unlink user dulu baru delete employee.
 *    - Aman, tapi kalau DB down di tengah-tengah unlink → delete bisa gagal.
 *    - Lebih kuat pakai transaction:
 *        await prisma.$transaction([
 *          prisma.user.updateMany({ where: { employeeId: id }, data: { employeeId: null } }),
 *          prisma.employee.delete({ where: { id } })
 *        ]);
 *
 * 5. Type safety
 *    - `const whereClause: any = {};` → bisa diganti lebih aman pakai Prisma type:
 *        const whereClause: Prisma.EmployeeWhereInput = {};
 */
