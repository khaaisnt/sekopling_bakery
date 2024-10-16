import { Router } from "express";
import { createMaterial, readMaterial, updateMaterial, deleteMaterial } from "../controller/MaterialController";

const router = Router();

router.post(`/`, createMaterial);

router.get(`/`, readMaterial);

router.put(`/:id`, updateMaterial);

router.delete(`/:id`, deleteMaterial);

export default router;