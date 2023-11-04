import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { setCookies } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler(400, "Invalid email or password"));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    setCookies(user, res, 201, `welcome ${user.name}`);
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler(400, "User already exists"));

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    setCookies(user, res, 201, "User created successfully");
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      message: "logout successfully",
    });
};
