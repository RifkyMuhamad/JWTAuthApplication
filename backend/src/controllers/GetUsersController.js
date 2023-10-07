import Users from "../models/UserModel.js";

export const GetUsers = async (req, res) => {
  try {
    const user = await Users.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};
