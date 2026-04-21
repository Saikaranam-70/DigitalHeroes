import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getCache, setCache } from "../config/redis.js";

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const cacheKey = `user:${decoded.id}`;

    let user = await getCache(cacheKey);
    if (!user) {
      user = await User.findById(decoded.id).select("-password").populate("charity.charityId", "name image");
      if (!user) return res.status(401).json({ message: "User not found" });
      await setCache(cacheKey, JSON.parse(JSON.stringify(user)), 300);
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export const subscribed = (req, res, next) => {
  if (req.user?.subscription?.status !== "active") {
    return res.status(403).json({ message: "Active subscription required" });
  }
  next();
};
