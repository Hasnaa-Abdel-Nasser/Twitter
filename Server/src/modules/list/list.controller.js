import * as query from "../../../database/models/list.model.js";
import { AppError } from "../../utils/response.error.js";
import { catchError } from "../../middleware/catch.errors.js";

export const createNewList = catchError(async(req , res , next)=>{
  const {listName , description , listState=true} = req.body;
  const {success , message} = await query.newList(req.user.id , listName, description, listState);
  if(!success){
    return next(new AppError(message , 400));
  }
  res.status(200).json({message});
});

export const editListInfo = catchError(async (req , res , next)=>{
  const list = await query.findList(req.body.id , req.user.id);
  if(!list){
    return next(new AppError("Can't find the list to edit. Please try again later." , 400));
  }
  const{listName = list.list_name , description = list.description , listState = list.list_state} = req.body;
  const {success , message} = await  query.editList(req.body.id , req.user.id , listName, description, listState);
  if(!success){
    return next(new AppError(message , 400));
  }
  res.status(200).json({message});
});

export const manageFollowingList = catchError(async(req , res , next)=>{
  const{id} = req.params;
  const alreadyFollowing = await query.findUser(id , req.user.id);
  const {success , message} = alreadyFollowing
    ? await query.unfollowList(id , req.user.id)
    : await query.followList(id , req.user.id);
  if(!success){
    return next(new AppError(message , 400));
  }
  res.status(200).json({message});
});

export const manageMembersList = catchError(async(req , res , next)=>{
  const {id , memberId} = req.body;
  const memberAdded = await query.listMember(id , memberId);
  const {success , message} = memberAdded
    ? await query.removeMember(id , memberId)
    : await query.addMember(id , memberId);
  if(!success){
    return next(new AppError(message , 400));
  }
  res.status(200).json({message});
});

export const deleteList = catchError(async(req , res , next)=>{
  const {id} = req.params;
  const {success , message} = await query.deleteList(id , req.user.id);
  if(!success){
    return next(new AppError(message , 400));
  }
  res.status(200).json({message});
});

export const getListTweets= catchError(async(req , res , next)=>{});
