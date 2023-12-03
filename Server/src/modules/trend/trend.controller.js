import * as query from "../../../database/models/trend.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const getTrends = catchError(async (req , res , next) => {
    try{
        const trends = await query.trends();
        res.status(200).json({trends: trends || []});
    }catch(error){
        next(new AppError(error.message , 500));
    }
});

export const trind = catchError(async (req , res , next)=>{

});

