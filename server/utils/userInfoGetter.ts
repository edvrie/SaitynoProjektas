import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';
import userModel from '../schemas/user';

export const getCurrentUser = async (email: string, password: string) => {
    try{
        const user = await userModel.findOne({
            email: email,
            password: password
        });
        console.log(user)
        return user;
    } catch (e) {
        console.log(e);
    }
};