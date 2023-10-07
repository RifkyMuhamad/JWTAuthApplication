import Users from "../models/UserModel.js";

export const Logout = async (req, res) => {
  const refreshTokenCookie = req.cookies.refreshToken;

  try {
    if (!refreshTokenCookie) return res.sendStatus(204);

    const userCookie = await Users.findOne({
      where: {
        refresh_token: refreshTokenCookie,
      },
    });

    if (!userCookie) return res.sendStatus(204);

    await Users.update(
      { refresh_token: null },
      {
        where: {
          id: userCookie.id,
        },
      }
    );

    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};
