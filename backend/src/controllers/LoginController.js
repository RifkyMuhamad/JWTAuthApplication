import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";

export const Login = async (req, res) => {

    const loginSchema = Joi.object({
      emailOrUsername: Joi.string().required().messages({
        "any.required": "Email or Username must not be blank",
        "string.empty": "Email or Username must not be blank"
      }),
      password: Joi.string().required().messages({
        "any.required": "Password must not be blank",
        "string.empty": "Password must not be blank"
      }),
    });
  
    try {
  
      const { emailOrUsername, password } = req.body;
  
      const result = loginSchema.validate(req.body, { abortEarly: false });
  
      if (result.error) {
        const errorMessage = result.error.details.map((e) => {return {
          messages: e.message
        };
      });
        return res.status(422).json({ msg: errorMessage });
      }
  
      const isEmail = Joi.string().email().validate(emailOrUsername).error === undefined;
  
      let user;
      if (isEmail) {
        user = await Users.findOne({
          where: {
            email: emailOrUsername,
          },
        });
      } else {
        user = await Users.findOne({
          where: {
            name: emailOrUsername,
          },
        });
      }
  
      if (!user) return res.status(404).json({ msg: "Email or Username not found" });
  
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
  
      await Users.update(
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