import * as query from "../../../database/models/media.model.js";
import * as tweetQuery from "../../../database/models/tweet.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";
import {removeFromCloudinary} from "../../utils/files.uploads.js";

export const deleteTweetMedia = catchError(async (req, res, next) => {
  const { id } = req.params;
  // Get media details
  const [media] = await query.getMedia(id);
  if (media[0].user_id != req.user.id) {
    return next(new AppError("You don't have permission to delete this media.", 400));
  }
  await removeFromCloudinary(media[0].public_id); // Remove media from Cloudinary
  await query.deleteMedia(id); // Delete media entry from the database
  res.status(200).json({ message: "Media deletion successful." });
});
