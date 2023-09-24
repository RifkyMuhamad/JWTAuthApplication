import users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken;
        
        if (!refreshTokenCookie) return res.sendStatus(401);

        const userCookie = await users.findAll({
            where: {
                refresh_token: refreshTokenCookie
            }
        });

        if (!userCookie[0]) return res.sendStatus(403);
        jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const userId = userCookie[0].id;
            const userName = userCookie[0].name;
            const userEmail = userCookie[0].email;
            const accessToken = jwt.sign({userId, userName, userEmail}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s'
            });
            res.json({accessToken});
        });
    } catch (error) {
        console.log(error)
    }
}