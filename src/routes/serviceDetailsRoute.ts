import { Router } from "express";
import {
  createServiceDetail,
  getAllServiceDetails,
  getServiceDetailById,
  updateServiceDetail,
  deleteServiceDetail,
  getTennisServiceDetails
} from "../controllers/serviceDetails/serviceDetailsController";

const router = Router();

router.post("/", createServiceDetail);
router.get("/", getAllServiceDetails);
router.get("/tennis", getTennisServiceDetails);
router.get("/:id", getServiceDetailById);
router.put("/:id", updateServiceDetail);
router.delete("/:id", deleteServiceDetail);

export default router;
