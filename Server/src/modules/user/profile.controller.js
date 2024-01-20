import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";
import * as query from "../../../database/models/user.model.js";
import { uploadToCloudinary } from "../../utils/files.uploads.js";

export const updateProfileData = catchError(async (req, res, next) => {
  if (req.body.website && !isValidUrl(req.body.website)) {
    return next(new AppError("Invalid website url", 400));
  }
  const [userData] = await query.getUserData(req.user.id);
  const dataChnaged = ifDataChanged(userData[0] , req.body)
  if (dataChnaged === false) {
    return next(new AppError("No changes detected.", 400));
  }
  await query.updateProfile(dataChnaged);
  res.status(200).json({ message: "Update profile data successful." });
});

export const uploadProfileImage = catchError(async (req, res, next) => {
  if (!req.file) return next(new AppError("Please upload profile image.", 400));
  const {url} = await uploadToCloudinary(req.file.path , "users");
  await query.uploadImage(req.user.id, url, "profile");
  res.status(200).json({ message: "Upload profile image successful." });
});

export const uploadProfileCover = catchError(async (req, res, next) => {
  if (!req.file) return next(new AppError("Please upload cover image.", 400));
  const {url} = await uploadToCloudinary(req.file.path , "users");
  await query.uploadImage(req.user.id, url, "cover")
  res.status(200).json({ message: "Upload cover image successful." });
});

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

function ifDataChanged(lastData, newData) {
  const newUserData = {
    id:lastData.id,
    name: newData.name ?? lastData.name,
    birth_date: newData.birthDate ?? lastData.birth_date,
    bio: newData.bio ?? lastData.bio,
    location: newData.location ?? lastData.location,
    website: newData.website ?? lastData.website,
  };
  const userData ={
    id:lastData.id,
    name : lastData.name,
    birth_date: lastData.birth_date,
    bio: lastData.bio,
    location: lastData.location,
    website: lastData.website,
  };
  if(Object.keys(newUserData).some(key => newUserData[key] !== userData[key])){
    return newUserData;
  }
  return false;
}