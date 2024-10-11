import multer from "multer";
import { Request } from "express";
import { ROOT_DIRECTORY } from "../config";

// membuat storage untuk menyimpan file
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) => {
    const storagePath = `${ROOT_DIRECTORY}/public/cake-image`;
    callback(null, storagePath);
  },
  filename:(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ) => {
    const fileName = `${Math.random()}-${file.originalname}`;
    callback(null, fileName);
  }
});

// fungsi filtering file
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
) => {
    
}
