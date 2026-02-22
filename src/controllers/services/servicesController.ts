import { Request, Response } from "express";
import prisma from "../../config/prisma";
import {
  CreateServiceDTO,
  UpdateServiceDTO,
  ListServicesQueryDTO,
} from "../../modules/services"

// ==========================
// CREATE
// ==========================
export const createService = async (
  req: Request<{}, {}, CreateServiceDTO>,
  res: Response
) => {
  try {
    const { name, description } = req.body;

    const service = await prisma.service.create({
      data: { name, description },
    });

    return res.status(201).json(service);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create service" });
  }
};

// ==========================
// GET ALL
// ==========================
export const getAllServices = async (
  req: Request<{}, {}, {}, ListServicesQueryDTO>,
  res: Response
) => {
  try {
    const { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } =
      req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [services, total] = await Promise.all([
    prisma.service.findMany({
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: order },
      include: {
        _count: { select: { serviceDetails: true } },
      },
    }),
    prisma.service.count(),
  ]);

  const data = services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    createdAt: s.createdAt,
    modifiedAt: s.modifiedAt,
    serviceDetailsCount: s._count.serviceDetails,
  }));

  return res.status(200).json({
    total,
    page: Number(page),
    limit: Number(limit),
    data,
  });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch services" });
  }
};

// ==========================
// GET BY ID
// ==========================
export const getServiceById = async (req: Request<{ id: string }>,res: Response) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        _count: { select: { serviceDetails: true } },
        serviceDetails: {
          where: { isAvailable: true, serviceId: id },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json(service);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch service" });
  }
};

// ==========================
// UPDATE
// ==========================
export const updateService = async (
  req: Request<{ id: string }, {}, UpdateServiceDTO>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.service.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Service not found" });
    }

    const updated = await prisma.service.update({
      where: { id },
      data,
    });

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update service" });
  }
};

// ==========================
// DELETE
// ==========================
export const deleteService = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const existing = await prisma.service.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Service not found" });
    }

    await prisma.service.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete service" });
  }
};
