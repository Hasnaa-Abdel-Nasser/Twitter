import multer from "multer";
import { AppError } from "./response.error.js";
import cloudinary from "./cloudinary.js";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const Upload = () => {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpeg" , "image/gif"];
    const allowedVideoTypes = ["video/mp4"];
    if (
      allowedImageTypes.includes(file.mimetype) ||
      allowedVideoTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new AppError("Invalid file type. Allowed types: jpg, jpeg , png, gif , mp4",400),false);
    }
  }
  return multer({ storage, fileFilter });
};

export const SingleFile = (fieldName) => {
  return Upload().single(fieldName);
};

export const MultiFile = (arrayOfFields) => {
  return Upload().fields(arrayOfFields);
};

export const resizeMedia = async (file, folder) => {
  const destinationPath = path.resolve(file.destination, "resized");

  await fs.mkdir(destinationPath, { recursive: true });

  const resizedFilePath = path.resolve(destinationPath, file.filename);

  if(file.mimetype.includes(file.mimetype.includes('image/gif') || file.mimetype.includes('video'))){

    await fs.copyFile(file.path, resizedFilePath);

  }else if (file.mimetype.includes('image')) {

    await sharp(file.path)
      .resize(500, 500)
      .jpeg({ quality: 50 })
      .toFile(resizedFilePath);

  }else {

    return new AppError(`Unsupported media type: ${file.mimetype}`,400);

  }
  return await uploadToCloudinary(resizedFilePath , folder)
};

export const uploadToCloudinary = async(file , folder)=>{
  const result = await cloudinary.uploader.upload(file, { folder });

  return { url: result.url, publicId: result.public_id };
}
export const removeFromCloudinary = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};
