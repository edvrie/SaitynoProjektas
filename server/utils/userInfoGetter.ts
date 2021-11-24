import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';
import userModel from '../schemas/user';
import ApiError from './ApiError';

export const validateId = (req, res, next) => {
    if (req.params.id){
        const match = req.params.id.match(/^[0-9a-fA-F]{24}$/);
        if (match === null){
            next(ApiError.badRequest("Bad id"));
            return;
        }
    }
    if (req.params.themeId) {
        const matchTheme = req.params.themeId.match(/^[0-9a-fA-F]{24}$/);
        if (matchTheme === null){
            next(ApiError.badRequest("Bad theme id"));
            return;
        }
    }
    if (req.params.postId) {
        const matchPost = req.params.postId.match(/^[0-9a-fA-F]{24}$/);
        if (matchPost === null){
            next(ApiError.badRequest("Bad post id"));
            return;
        }
    }
    if (req.params.commentId) {
        const matchComment = req.params.commentId.match(/^[0-9a-fA-F]{24}$/);
        if (matchComment === null){
            next(ApiError.badRequest("Bad comment id"));
            return;
        }
    }
    next();
    return;
}