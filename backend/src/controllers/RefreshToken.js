import users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    if (!refreshTokenCookie) return res.sendStatus(401); // Unauthorized

    const userCookie = await users.findOne({
      where: {
        refresh_token: refreshTokenCookie,
      },
    });

    if (!userCookie) return res.sendStatus(403); // Forbidden

    jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET, (err) => {
      if (err) return res.sendStatus(403); // Forbidden

      const { id, name, email } = userCookie;

      const accessToken = jwt.sign(
        { userId: id, userName: name, userEmail: email },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15s",
        }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Server Error" });
  }
};
