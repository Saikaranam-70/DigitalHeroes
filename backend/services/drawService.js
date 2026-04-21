import User from "../models/User.js";

const getUniqueRandomNumbers = (count, min, max) => {
  const nums = new Set();
  while (nums.size < count) {
    nums.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return [...nums];
};

export const runRandomDraw = () => getUniqueRandomNumbers(5, 1, 45);

export const runAlgorithmicDraw = async () => {
  const users = await User.find({ "subscription.status": "active" }).select("scores");

  const frequency = {};
  for (const user of users) {
    for (const s of user.scores) {
      frequency[s.score] = (frequency[s.score] || 0) + 1;
    }
  }

  const allScores = Object.keys(frequency).map(Number);
  if (allScores.length < 5) return runRandomDraw();

  // weight by frequency — least common scores drawn more likely
  const maxFreq = Math.max(...Object.values(frequency));
  const weights = allScores.map((s) => maxFreq - (frequency[s] || 0) + 1);
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const picked = new Set();
  let attempts = 0;
  while (picked.size < 5 && attempts < 1000) {
    let rand = Math.random() * totalWeight;
    for (let i = 0; i < allScores.length; i++) {
      rand -= weights[i];
      if (rand <= 0) {
        picked.add(allScores[i]);
        break;
      }
    }
    attempts++;
  }

  if (picked.size < 5) return runRandomDraw();
  return [...picked];
};

export const matchUserScores = (userScores, drawnNumbers) => {
  const scoreValues = userScores.map((s) => s.score);
  const matched = scoreValues.filter((s) => drawnNumbers.includes(s));
  return matched;
};

export const determineMatchType = (matchCount) => {
  if (matchCount >= 5) return "5-match";
  if (matchCount === 4) return "4-match";
  if (matchCount === 3) return "3-match";
  return null;
};

export const calculatePrizePool = (subscriberCount, plan = "monthly") => {
  const planAmount = plan === "yearly"
    ? parseInt(process.env.YEARLY_PLAN_AMOUNT) / 12
    : parseInt(process.env.MONTHLY_PLAN_AMOUNT);

  const total = subscriberCount * planAmount;
  return {
    total,
    fiveMatch: Math.floor(total * 0.4),
    fourMatch: Math.floor(total * 0.35),
    threeMatch: Math.floor(total * 0.25),
  };
};

export const findDrawWinners = async (drawnNumbers) => {
  const users = await User.find({ "subscription.status": "active" }).select("name email scores");
  const winners = { "5-match": [], "4-match": [], "3-match": [] };

  for (const user of users) {
    const matched = matchUserScores(user.scores, drawnNumbers);
    const type = determineMatchType(matched.length);
    if (type) {
      winners[type].push({ userId: user._id, matchedNumbers: matched });
    }
  }

  return winners;
};
