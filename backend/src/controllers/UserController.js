import users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const user = await users.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(422).json({ msg: "Please fill in all fields" });
    }

    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ msg: "Password and Confirm Password tidak cocok" });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await users.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    res.json({ msg: "Registration Successfull" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await users.findOne({
      where: {
        email: email,
      },
    });

    if (!user) return res.status(404).json({ msg: "Email not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const { id, name, email: userEmail } = user;
    const accessToken = jwt.sign(
      { userId: id, userName: name, userEmail },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    const refreshToken = jwt.sign(
      { userId: id, userName: name, userEmail },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: id,
        },
      }
    );

    // for localhost

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // for https

    // res.cookie('refreshToken', refreshToken, {
    //     httpOnly: true,
    //     maxAge: 24 * 60 * 60 * 1000, // 1 day
    //     secure: true
    // });

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const logout = async (req, res) => {
  const refreshTokenCookie = req.cookies.refreshToken;

  try {
    if (!refreshTokenCookie) return res.sendStatus(204);

    const userCookie = await users.findOne({
      where: {
        refresh_token: refreshTokenCookie,
      },
    });

    if (!userCookie) return res.sendStatus(204);

    await users.update(
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
