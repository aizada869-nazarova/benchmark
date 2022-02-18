import User from "../services/users/schema.js"
import jwt from "jsonwebtoken"

export const JWTAuthenticate = async user => {
   
    const accessToken = await generateJWT({ _id: user._id })
    const refreshToken = await generateRefreshJWT({ _id: user._id })
    user.refreshToken = refreshToken
    await user.save()
    return { accessToken, refreshToken }
}

const generateJWT = payload =>
    new Promise((resolve, reject) =>
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2 days" }, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    )

const generateRefreshJWT = payload =>
    new Promise((resolve, reject) =>
        jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "1 week" }, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    )

export const verifyJWT = token =>
    new Promise((resolve, reject) =>
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) reject(err)
            resolve(decodedToken)
        })
    )

export const verifyRefreshJWT = token =>
    new Promise((resolve, reject) =>
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
            if (err) reject(err)
            resolve(decodedToken)
        })
    )
    
export const refreshTokens = async actualRefreshToken => {
    try {
        const decoded = await verifyRefreshJWT(actualRefreshToken)
        const user = await User.findById(decoded._id)

        if (!user) throw new Error("User not found!")
        if (actualRefreshToken === user.refreshToken) {
            const { accessToken, refreshToken } = await JWTAuthenticate(user)
            return { accessToken, refreshToken }
        } else {
            console.log("do nothing")
        }
    } catch (error) {
        createError(401, "Token not valid!")
    }
}
