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
    // extensi file yang diizinkan
    const allowedFile = /png|jpg|jpeg|gif/;
    // cek extensi file yang diupload
    const isAllow = allowedFile.test(file.mimetype);
    if (isAllow){
        callback(null, true);
    }else{
      callback(new Error("File type not allowed"));
    }
}

const uploadCakeImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {fileSize: 2 * 1024 * 1024} // 2MB
})

export { uploadCakeImage };
