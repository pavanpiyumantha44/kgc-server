import { Request, Response } from "express";
import prisma from "../../config/prisma";
import {
  CreateServiceDetailDTO,
  UpdateServiceDetailDTO,
  ListServiceDetailQueryDTO,
} from "../../modules/serviceDetail";

// ==========================
// CREATE
// ==========================
export const createServiceDetail = async (
  req: Request<{}, {}, CreateServiceDetailDTO>,
  res: Response
) => {
  try {
    const data = req.body;

    const serviceExists = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!serviceExists) {
      return res.status(404).json({ message: "Parent service not found" });
    }

    const detail = await prisma.serviceDetail.create({
      data,
    });

    return res.status(201).json(detail);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create service detail" });
  }
};

// ==========================
// GET ALL
// ==========================
export const getAllServiceDetails = async (
  req: Request<{}, {}, {}, ListServiceDetailQueryDTO>,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      serviceId,
      isAvailable,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(serviceId && { serviceId }),
      ...(isAvailable !== undefined && {
        isAvailable: isAvailable === true
      }),
    };

    const [data, total] = await Promise.all([
      prisma.serviceDetail.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: order },
        include: { service: true },
      }),
      prisma.serviceDetail.count({ where }),
    ]);

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      data,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch service details" });
  }
};

// ==========================
// GET BY ID
// ==========================
export const getServiceDetailById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const detail = await prisma.serviceDetail.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!detail) {
      return res.status(404).json({ message: "Service detail not found" });
    }

    return res.status(200).json(detail);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch service detail" });
  }
};

// ==========================
// UPDATE
// ==========================
export const updateServiceDetail = async (
  req: Request<{ id: string }, {}, UpdateServiceDetailDTO>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const exists = await prisma.serviceDetail.findUnique({
      where: { id },
    });

    if (!exists) {
      return res.status(404).json({ message: "Service detail not found" });
    }

    const updated = await prisma.serviceDetail.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update service detail" });
  }
};

// ==========================
// DELETE
// ==========================
export const deleteServiceDetail = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const exists = await prisma.serviceDetail.findUnique({
      where: { id },
    });

    if (!exists) {
      return res.status(404).json({ message: "Service detail not found" });
    }

    await prisma.serviceDetail.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Service detail deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete service detail" });
  }
};
