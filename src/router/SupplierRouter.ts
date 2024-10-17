import { Router } from "express";
import {
  createSupllier,
  readSupllier,
  updateSupplier,
  deleteSupplier,
} from "../controller/SupllierController";

const router = Router();

router.post(`/`, createSupllier);

router.get(`/:id`, readSupllier);

router.put(`/:id`, updateSupplier);

router.delete(`/:id`, deleteSupplier);

export default router;
