import Draw from "../models/Draw.js";
import User from "../models/User.js";
import { getCache, setCache, delCache } from "../config/redis.js";
import {
  runRandomDraw,
  runAlgorithmicDraw,
  findDrawWinners,
  calculatePrizePool,
} from "../services/drawService.js";
import { sendDrawResultEmail } from "../services/emailService.js";

export const getDraws = async (req, res, next) => {
  try {
    const cached = await getCache("draws:published");
    if (cached) return res.json(cached);

    const draws = await Draw.find({ status: "published" })
      .sort({ year: -1, month: -1 })
      .limit(12)
      .populate("winners.userId", "name");

    await setCache("draws:published", { draws }, 600);
    res.json({ draws });
  } catch (err) {
    next(err);
  }
};

export const getCurrentDraw = async (req, res, next) => {
  try {
    const now = new Date();
    const draw = await Draw.findOne({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });
    res.json({ draw });
  } catch (err) {
    next(err);
  }
};

export const getUserDrawHistory = async (req, res, next) => {
  try {
    const draws = await Draw.find({
      status: "published",
      "winners.userId": req.user._id,
    }).sort({ year: -1, month: -1 });

    res.json({ draws });
  } catch (err) {
    next(err);
  }
};

export const uploadWinnerProof = async (req, res, next) => {
  try {
    const { drawId, proofUrl } = req.body;

    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ message: "Draw not found" });

    const winner = draw.winners.find((w) => w.userId.toString() === req.user._id.toString());
    if (!winner) return res.status(404).json({ message: "You are not a winner in this draw" });

    winner.proofUrl = proofUrl;
    winner.verificationStatus = "pending";
    await draw.save();

    res.json({ message: "Proof submitted for review" });
  } catch (err) {
    next(err);
  }
};

// admin
export const configureDraw = async (req, res, next) => {
  try {
    const { month, year, drawType } = req.body;
    const now = new Date();

    let draw = await Draw.findOne({ month, year });
    if (!draw) {
      draw = new Draw({ month, year, drawType: drawType || "random" });
    } else {
      draw.drawType = drawType || draw.drawType;
    }

    const subscriberCount = await User.countDocuments({ "subscription.status": "active" });
    draw.activeSubscriberCount = subscriberCount;

    const prevDraw = await Draw.findOne({
      month: month === 1 ? 12 : month - 1,
      year: month === 1 ? year - 1 : year,
      status: "published",
    });

    const carryover = prevDraw?.prizePool?.jackpotCarryover || 0;
    const pool = calculatePrizePool(subscriberCount);
    draw.prizePool = {
      ...pool,
      fiveMatch: pool.fiveMatch + carryover,
      jackpotCarryover: 0,
    };

    await draw.save();
    res.json({ draw });
  } catch (err) {
    next(err);
  }
};

export const simulateDraw = async (req, res, next) => {
  try {
    const { drawId } = req.params;
    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ message: "Draw not found" });

    const numbers = draw.drawType === "algorithmic"
      ? await runAlgorithmicDraw()
      : runRandomDraw();

    const winners = await findDrawWinners(numbers);

    draw.simulationResult = { numbers, winners, simulatedAt: new Date() };
    draw.status = "simulated";
    await draw.save();

    res.json({ simulation: draw.simulationResult });
  } catch (err) {
    next(err);
  }
};

export const publishDraw = async (req, res, next) => {
  try {
    const { drawId } = req.params;
    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ message: "Draw not found" });

    const numbers = draw.drawType === "algorithmic"
      ? await runAlgorithmicDraw()
      : runRandomDraw();

    draw.drawnNumbers = numbers;
    const allWinners = await findDrawWinners(numbers);

    const winnerEntries = [];
    let jackpotWinners = allWinners["5-match"].length;

    for (const [matchType, winners] of Object.entries(allWinners)) {
      if (winners.length === 0) continue;

      const poolKey = matchType === "5-match" ? "fiveMatch" : matchType === "4-match" ? "fourMatch" : "threeMatch";
      const poolAmount = draw.prizePool[poolKey] || 0;
      const sharePerWinner = winners.length > 0 ? Math.floor(poolAmount / winners.length) : 0;

      for (const w of winners) {
        winnerEntries.push({
          userId: w.userId,
          matchType,
          matchedNumbers: w.matchedNumbers,
          prizeAmount: sharePerWinner,
        });
      }
    }

    if (jackpotWinners === 0) {
      draw.prizePool.jackpotCarryover = draw.prizePool.fiveMatch;
    }

    draw.winners = winnerEntries;
    draw.status = "published";
    await draw.save();

    // notify winners
    const winnerUsers = await User.find({ _id: { $in: winnerEntries.map((w) => w.userId) } }).select("name email");
    for (const entry of winnerEntries) {
      const u = winnerUsers.find((u) => u._id.toString() === entry.userId.toString());
      if (u) await sendDrawResultEmail(u.email, u.name, entry.matchType, entry.prizeAmount).catch(() => {});
    }

    await delCache("draws:published");
    res.json({ draw });
  } catch (err) {
    next(err);
  }
};

export const verifyWinner = async (req, res, next) => {
  try {
    const { drawId, winnerId, action } = req.body;

    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ message: "Draw not found" });

    const winner = draw.winners.id(winnerId);
    if (!winner) return res.status(404).json({ message: "Winner not found" });

    winner.verificationStatus = action === "approve" ? "approved" : "rejected";
    if (action === "approve") winner.paymentStatus = "pending";

    await draw.save();
    res.json({ message: `Winner ${action}d` });
  } catch (err) {
    next(err);
  }
};

export const markPaid = async (req, res, next) => {
  try {
    const { drawId, winnerId } = req.body;

    const draw = await Draw.findById(drawId);
    const winner = draw?.winners.id(winnerId);
    if (!winner) return res.status(404).json({ message: "Winner not found" });

    winner.paymentStatus = "paid";
    winner.paidAt = new Date();
    await draw.save();

    res.json({ message: "Marked as paid" });
  } catch (err) {
    next(err);
  }
};
