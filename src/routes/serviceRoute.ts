import { Router } from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getAllSports,
  getProvidingServices
} from "../controllers/services/servicesController";

const router = Router();

router.post("/", createService);
router.get("/", getAllServices);
router.get("/sports", getAllSports);
router.get("/services", getProvidingServices);
router.get("/:id", getServiceById);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
