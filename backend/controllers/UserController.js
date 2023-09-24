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
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ msg: "Password and Confirm Password tidak cocok" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await users.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    res.json({ msg: "Register success" });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const user = await users.findAll({
      where: {
        email: req.body.email,
      },
    });

    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const userId = user[0].id;
    const userName = user[0].name;
    const userEmail = user[0].email;
    const accessToken = jwt.sign({ userId, userName, userEmail }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign({ userId, userName, userEmail }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    await users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    // for localhost
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // for https
    // res.cookie('refreshToken', refreshToken, {
    //     httpOnly: true,
    //     maxAge: 24 * 60 * 60 * 1000,
    //     secure: true
    // });

    res.json({
      accessToken,
    });
  } catch (error) {
    res.status(404).json({ msg: "Email not found" });
  }
};

export const logout = async (req, res) => {
  const refreshTokenCookie = req.cookies.refreshToken;

  if (!refreshTokenCookie) return res.sendStatus(204);

  const userCookie = await users.findAll({
    where: {
      refresh_token: refreshTokenCookie,
    },
  });

  if (!userCookie[0]) return res.sendStatus(204);
  const userId = userCookie[0].id;
  await users.update({refresh_token: null}, {
    where: {
        id: userId
    }
  });

  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};
