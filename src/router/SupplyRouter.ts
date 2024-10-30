import { Router } from "express";
import { createSupply, readSupply, updateSupply, deleteSupply } from "../controller/SupplyController";

const router = Router();

router.post(`/`, createSupply);

router.get(`/`, readSupply);

router.put(`/:id`, updateSupply);

router.delete(`/:id`, deleteSupply);

export default router;

