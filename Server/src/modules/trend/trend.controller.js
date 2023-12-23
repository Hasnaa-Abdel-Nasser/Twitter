import * as query from "../../../database/models/trend.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const getTrends = catchError(async (req , res , next) => {
    const trends = await query.trends();
    res.status(200).json({trends: trends || []});
});

export const trind = catchError(async (req , res , next)=>{

});

