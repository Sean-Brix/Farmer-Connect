import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export async function createToken(req, res, next){

    const userID = req.userID
    const username = req.username
    const ACCESS_KEY = process.env.ACCESS_KEY

    const token = jwt.sign(
        {ID: userID, username: username},       // PAYLOAD
        ACCESS_KEY,                             // SECRET_KEY
        {expiresIn: "1h"}                       // HEADERS
    )

    res.cookie("token", token, {
        secure: process.env.NODE_ENV === 'production'? true:false,
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        sameSite: "Lax"
    });

    next();
}

export async function verifyToken(req, res, next){

    //VERIFY AUTH

}