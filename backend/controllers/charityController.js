import Charity from "../models/Charity.js";
import User from "../models/User.js";
import { getCache, setCache, delCache } from "../config/redis.js";

export const getCharities = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const cacheKey = `charities:${search || ""}:${category || ""}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const query = { isActive: true };
    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;

    const charities = await Charity.find(query).sort({ isFeatured: -1, name: 1 });
    const result = { charities };

    await setCache(cacheKey, result, 600);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getCharity = async (req, res, next) => {
  try {
    const cached = await getCache(`charity:${req.params.id}`);
    if (cached) return res.json(cached);

    const charity = await Charity.findById(req.params.id);
    if (!charity) return res.status(404).json({ message: "Charity not found" });

    await setCache(`charity:${req.params.id}`, charity, 600);
    res.json(charity);
  } catch (err) {
    next(err);
  }
};

export const selectCharity = async (req, res, next) => {
  try {
    const { charityId, percentage } = req.body;

    const charity = await Charity.findById(charityId);
    if (!charity || !charity.isActive) {
      return res.status(404).json({ message: "Charity not found" });
    }

    const pct = Math.min(100, Math.max(10, percentage || 10));

    // update old charity subscriber count
    if (req.user.charity?.charityId) {
      await Charity.findByIdAndUpdate(req.user.charity.charityId, { $inc: { subscriberCount: -1 } });
    }

    await User.findByIdAndUpdate(req.user._id, {
      "charity.charityId": charityId,
      "charity.percentage": pct,
    });

    await Charity.findByIdAndUpdate(charityId, { $inc: { subscriberCount: 1 } });
    await delCache(`user:${req.user._id}`);

    res.json({ message: "Charity selected", charityId, percentage: pct });
  } catch (err) {
    next(err);
  }
};

// admin
export const createCharity = async (req, res, next) => {
  try {
    const charity = await Charity.create(req.body);
    await delCache("charities:*");
    res.status(201).json(charity);
  } catch (err) {
    next(err);
  }
};

export const updateCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!charity) return res.status(404).json({ message: "Not found" });
    await delCache(`charity:${req.params.id}`);
    res.json(charity);
  } catch (err) {
    next(err);
  }
};

export const deleteCharity = async (req, res, next) => {
  try {
    await Charity.findByIdAndDelete(req.params.id);
    await delCache(`charity:${req.params.id}`);
    res.json({ message: "Charity deleted" });
  } catch (err) {
    next(err);
  }
};
