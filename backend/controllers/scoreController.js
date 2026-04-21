import User from "../models/User.js";
import { delCache } from "../config/redis.js";

export const addScore = async (req, res, next) => {
  try {
    const { score, date } = req.body;
    const user = await User.findById(req.user._id);

    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    const duplicate = user.scores.find((s) => {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === inputDate.getTime();
    });

    if (duplicate) {
      return res.status(400).json({ message: "A score already exists for this date. Edit it instead." });
    }

    user.scores.push({ score, date: inputDate });
    user.scores.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (user.scores.length > 5) user.scores = user.scores.slice(0, 5);

    await user.save();
    await delCache(`user:${req.user._id}`);

    res.status(201).json({ scores: user.scores });
  } catch (err) {
    next(err);
  }
};

export const editScore = async (req, res, next) => {
  try {
    const { scoreId } = req.params;
    const { score, date } = req.body;
    const user = await User.findById(req.user._id);

    const entry = user.scores.id(scoreId);
    if (!entry) return res.status(404).json({ message: "Score not found" });

    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    const duplicate = user.scores.find((s) => {
      if (s._id.toString() === scoreId) return false;
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === inputDate.getTime();
    });

    if (duplicate) {
      return res.status(400).json({ message: "Another score already exists for this date" });
    }

    entry.score = score;
    entry.date = inputDate;
    user.scores.sort((a, b) => new Date(b.date) - new Date(a.date));

    await user.save();
    await delCache(`user:${req.user._id}`);

    res.json({ scores: user.scores });
  } catch (err) {
    next(err);
  }
};

export const deleteScore = async (req, res, next) => {
  try {
    const { scoreId } = req.params;
    const user = await User.findById(req.user._id);

    user.scores = user.scores.filter((s) => s._id.toString() !== scoreId);
    await user.save();
    await delCache(`user:${req.user._id}`);

    res.json({ scores: user.scores });
  } catch (err) {
    next(err);
  }
};

export const getScores = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("scores");
    res.json({ scores: user.scores });
  } catch (err) {
    next(err);
  }
};
