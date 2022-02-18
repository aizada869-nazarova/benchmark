import User from "../services/users/schema.js"
import createError from "http-errors"
import { verifyJWT } from "./tools.js"

export const JWTMiddleware = async (req, res, next) => {
    if (!req.headers.authorization) {
        next(createError(401, "Provide authorization header!"))
    } else {
        try {
            const token = req.headers.authorization.replace("Bearer ", "")

            const decodedToken = await verifyJWT(token)

            const user = await User.findById(decodedToken._id)

            if (user) {
                req.user = user
                next()
            } else {
                next(createError(404, "user not found!"))
            }

        } catch (error) {
            next(createError(401, "Token expired!"))
        }
    }
}