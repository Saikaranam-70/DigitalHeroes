import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Draw from "../models/Draw.js";
import Charity from "../models/Charity.js";
import { getCache, setCache, delCache } from "../config/redis.js";

export const getStats = async (req, res, next) => {
  try {
    const cached = await getCache("admin:stats");
    if (cached) return res.json(cached);

    const [totalUsers, activeSubscribers, totalPayments, charities] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ "subscription.status": "active" }),
      Payment.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, total: { $sum: "$amount" }, charity: { $sum: "$charityAmount" }, pool: { $sum: "$prizePoolAmount" } } }]),
      Charity.countDocuments({ isActive: true }),
    ]);

    const stats = {
      totalUsers,
      activeSubscribers,
      totalRevenue: totalPayments[0]?.total || 0,
      totalCharityContributions: totalPayments[0]?.charity || 0,
      totalPrizePool: totalPayments[0]?.pool || 0,
      activeCharities: charities,
    };

    await setCache("admin:stats", stats, 120);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: "user" };
    if (search) query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];

    const users = await User.find(query)
      .select("-password")
      .populate("charity.charityId", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);
    res.json({ users, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isActive, subscriptionStatus } = req.body;

    const update = {};
    if (isActive !== undefined) update.isActive = isActive;
    if (subscriptionStatus) update["subscription.status"] = subscriptionStatus;

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    await delCache(`user:${userId}`);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const editUserScore = async (req, res, next) => {
  try {
    const { userId, scoreId } = req.params;
    const { score, date } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const entry = user.scores.id(scoreId);
    if (!entry) return res.status(404).json({ message: "Score not found" });

    entry.score = score;
    if (date) entry.date = new Date(date);
    await user.save();
    await delCache(`user:${userId}`);

    res.json({ scores: user.scores });
  } catch (err) {
    next(err);
  }
};

export const getPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const payments = await Payment.find({ status: "paid" })
      .populate("userId", "name email")
      .sort({ paidAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments({ status: "paid" });
    res.json({ payments, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};
