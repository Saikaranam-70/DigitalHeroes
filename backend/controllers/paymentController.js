import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import { delCache } from "../config/redis.js";
import { sendSubscriptionEmail } from "../services/emailService.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLANS = {
  monthly: { amount: parseInt(process.env.MONTHLY_PLAN_AMOUNT || 999), duration: 30 },
  yearly: { amount: parseInt(process.env.YEARLY_PLAN_AMOUNT || 9999), duration: 365 },
};

export const createOrder = async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: "Invalid plan" });

    const { amount, duration } = PLANS[plan];

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${req.user._id.slice(-6)}_${Date.now().toString().slice(-6)}`,
      notes: { userId: req.user._id.toString(), plan },
    });

    const charityPct = req.user.charity?.percentage || 10;
    const charityAmount = Math.floor((amount * charityPct) / 100);
    const prizePoolAmount = amount - charityAmount;

    const payment = await Payment.create({
      userId: req.user._id,
      razorpayOrderId: order.id,
      amount,
      plan,
      charityAmount,
      prizePoolAmount,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      plan,
      duration,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
        paidAt: new Date(),
      },
      { new: true }
    );

    const duration = PLANS[plan]?.duration || 30;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        "subscription.status": "active",
        "subscription.plan": plan,
        "subscription.startDate": startDate,
        "subscription.endDate": endDate,
        "subscription.renewalDate": endDate,
        "subscription.razorpaySubscriptionId": razorpay_payment_id,
      },
      { new: true }
    ).select("-password");

    await delCache(`user:${req.user._id}`);
    await sendSubscriptionEmail(user.email, user.name, plan, endDate).catch(() => {});

    res.json({ message: "Subscription activated", user });
  } catch (err) {
    next(err);
  }
};

export const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ payments });
  } catch (err) {
    next(err);
  }
};
