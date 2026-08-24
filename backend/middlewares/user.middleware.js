import asyncHandler from "../utils/asyncHadler.js";
import ApiError from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";

export const verify = asyncHandler(
    async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            const token = req.cookies?.accessToken || (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

            if (!token) throw new ApiError(400, "invalid token");

            console.log("Token exists:", !!token);
            console.log("Token parts:", token?.split(".").length);

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const user = await User.findById(decoded._id);
            if (!user) throw new ApiError(400, "invalid token");

            req.user = user;
            next();
        } catch (error) {
            console.log("error in middleware : ", error);
            throw error;
        }
    }
);