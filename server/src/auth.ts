import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';

export const checkAuth = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (err) {
        next(ApiError.unauthorized("You must be logged in"));
        return;
    }
};