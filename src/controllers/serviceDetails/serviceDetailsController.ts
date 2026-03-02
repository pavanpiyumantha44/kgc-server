import { Request, Response } from "express";
import prisma from "../../config/prisma";
import {
  CreateServiceDetailDTO,
  UpdateServiceDetailDTO,
  ListServiceDetailQueryDTO,
} from "../../modules/serviceDetail";

// ==============================
// DTO Mapper
// ==============================
const toServiceDetailDto = (item: any) => ({
  id: item.id,
  name: item.providedService,
  description: item.description ?? "",
  localCost: item.localCost ?? 0,
  foreignCost: item.foreignCost ?? 0,
  serviceName: item.service?.name ?? "",
});

// ==============================
// CREATE
// ==============================
export const createServiceDetail = async (
  req: Request<{}, {}, CreateServiceDetailDTO>,
  res: Response
) => {
  try {
    const data = req.body;

    // Check parent service exists
    const serviceExists = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!serviceExists) {
      return res.status(404).json({ message: "Service not found" });
    }

    const created = await prisma.serviceDetail.create({
      data,
      include: { service: true },
    });

    return res.status(201).json(toServiceDetailDto(created));
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create service detail",
    });
  }
};

// ==============================
// GET ALL (Paginated)
// ==============================
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

    const where = { ...(serviceId && { serviceId }), ...(isAvailable !== undefined && { isAvailable: isAvailable === true }), };

    const [records, total] = await Promise.all([
      prisma.serviceDetail.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: order },
        include: { service: true },
      }),
      prisma.serviceDetail.count({ where }),
    ]);

    const data = records;

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch service details",
    });
  }
};

// ==============================
// GET BY ID
// ==============================
export const getServiceDetailById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const record = await prisma.serviceDetail.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!record) {
      return res.status(404).json({
        message: "Service detail not found",
      });
    }

    return res.status(200).json(toServiceDetailDto(record));
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch service detail",
    });
  }
};

// ==============================
// UPDATE
// ==============================
export const updateServiceDetail = async (
  req: Request<{ id: string }, {}, UpdateServiceDetailDTO>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const existing = await prisma.serviceDetail.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Service detail not found",
      });
    }

    const updated = await prisma.serviceDetail.update({
      where: { id },
      data: req.body,
      include: { service: true },
    });

    return res.status(200).json(toServiceDetailDto(updated));
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update service detail",
    });
  }
};

// ==============================
// DELETE
// ==============================
export const deleteServiceDetail = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const existing = await prisma.serviceDetail.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Service detail not found",
      });
    }

    await prisma.serviceDetail.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Service detail deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete service detail",
    });
  }
};


// GET /service-details/tennis
export const getTennisServiceDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await prisma.serviceDetail.findMany({
      where: {
        service: {
          name: {
            equals: "Tennis Courts",
            mode: "insensitive", // makes it case-insensitive
          },
        },
      },
      include: {
        service: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Optional: map to frontend DTO shape
    const formattedData = data.map((item) => ({
      id: item.id,
      name: item.providedService,
      description: item.description ?? "",
      localCost: item.localCost ?? 0,
      foreignCost: item.foreignCost ?? 0,
      serviceName: item.service.name,
    }));

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch tennis service details",
    });
  }
};