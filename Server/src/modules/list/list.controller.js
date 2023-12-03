import * as query from "../../../database/models/list.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const createNewList = catchError(async(req , res , next)=>{});

export const editListInfo = catchError(async (req , res , next)=>{});

export const editListState = catchError(async(req , res , next)=>{});

export const removeListPhoto = catchError(async(req , res , next)=>{});

export const manageFollowList = catchError(async(req , res , next)=>{});

export const manageMemberList = catchError(async(req , res , next)=>{});

export const deleteList = catchError(async(req , res , next)=>{});

export const getListTweets= catchError(async(req , res , next)=>{});
