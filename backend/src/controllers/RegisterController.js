import Joi from "joi";
import bcrypt from "bcrypt";
import Users from "../models/UserModel.js";

export const Register = async (req, res) => {

    const registerSchema = Joi.object({
      name: Joi.string().max(10).required().messages({
        "any.required": "Username must not blank",
        "string.empty": "Username must not blank",
        "string.max": "Username should not be more than {{#limit}} characters"
      }),
      email: Joi.string().email().required().messages({
        "any.required": "Email must not blank",
        "string.empty": "Email must not blank",
        "string.email": "Email must be valid",
      }),
      password: Joi.string().min(8).required().messages({
        "any.required": "Password must not blank",
        "string.empty": "Password must not blank",
        "string.min": "Password should be {{#limit}} characters or more",
      }),
      confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    }).messages({
      "any.required": "Confirm Password must not blank",
      "string.empty": "Confirm Password must not blank",
      "any.only": "Confirm Password must be the same as Password",
    });
  
    try {
  
      const result = registerSchema.validate(req.body, { abortEarly: false });
  
      if (result.error) {
        const errorMessage = result.error.details.map((e) => {return {
          messages: e.message
        };
      });
        return res.status(422).json({ msg: errorMessage });
      }
  
      const { name, email, password } = req.body;
  
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
  
      await Users.create({
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