import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { delCache } from "../config/redis.js";
import { sendWelcomeEmail } from "../services/emailService.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password });

    await sendWelcomeEmail(email, name).catch(() => {});

    res.status(201).json({
      token: signToken(user._id),
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("charity.charityId", "name image");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) return res.status(403).json({ message: "Account disabled" });

    res.json({
      token: signToken(user._id),
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    ).select("-password");

    await delCache(`user:${req.user._id}`);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();
    await delCache(`user:${req.user._id}`);

    res.json({ message: "Password updated" });
  } catch (err) {
    next(err);
  }
};
