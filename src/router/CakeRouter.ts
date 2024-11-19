import { Router } from "express";
import multer from "multer";
import { createCake, readCake, updateCake, deleteCake } from "../controller/CakeController";
import { createValidation, updateValidation, deleteValidation } from "../middleware/CakeValidation";
import { uploadCakeImage } from "../middleware/UploadCakeImage";

const router = Router();

router.post(`/`, [uploadCakeImage.single(`image`), createValidation], createCake);

router.get(`/`, readCake);

router.put(`/:id`, [uploadCakeImage.single(`image`), updateValidation], updateCake);

router.delete(`/:id`,[deleteValidation], deleteCake);

export default router;