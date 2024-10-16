import { Router } from "express";
import { createCake, readCake, updateCake, deleteCake } from "../controller/CakeController";
import { uploadCakeImage } from "../middleware/UploadCakeImage";

const router = Router();

router.post(`/`, [uploadCakeImage.single(`image`)], createCake);

router.get(`/`, readCake);

router.put(`/:id`, [uploadCakeImage.single(`image`)], updateCake);

router.delete(`/:id`, deleteCake);

export default router;