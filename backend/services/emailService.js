import nodemailer from "nodemailer";

/**
 * ✅ Brevo SMTP Transporter
 */
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: "a1302f001@smtp-brevo.com",   // keep as is
    pass: process.env.BREVO_API_KEY,    // ✅ correct env name
  },
});

/**
 * ✅ Common Email Sender
 */
const sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"GolfHero" <${process.env.EMAIL_FROM}>`, // must be verified in Brevo
    to,
    subject,
    html,
  });
};

/**
 * ✅ Base Template (Reusable UI)
 */
const baseTemplate = (content) => `
  <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 12px; overflow: hidden;">
    
    <div style="background: linear-gradient(135deg, #1a472a, #2d6a4f); padding: 32px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; color: #a8e6cf;">
        GOLF<span style="color: #fff">HERO</span>
      </h1>
    </div>

    <div style="padding: 32px;">
      ${content}
    </div>

    <div style="padding: 16px 32px; background: #111; text-align: center; font-size: 12px; color: #666;">
      © ${new Date().getFullYear()} GolfHero · Unsubscribe
    </div>

  </div>
`;

/**
 * ✅ Welcome Email
 */
export const sendWelcomeEmail = async (to, name) => {
  await sendEmail({
    to,
    subject: "Welcome to GolfHero 🏌️",
    html: baseTemplate(`
      <h2 style="color: #a8e6cf;">Welcome, ${name}!</h2>

      <p style="color: #ccc; line-height: 1.6;">
        You've joined the GolfHero community. Track your scores,
        enter monthly draws, and support charities you care about.
      </p>

      <a href="${process.env.FRONTEND_URL}/dashboard"
        style="display:inline-block;margin-top:16px;padding:12px 28px;background:#2d6a4f;color:#fff;border-radius:8px;text-decoration:none;">
        Go to Dashboard
      </a>
    `),
  });
};

/**
 * 🎉 Draw Result Email
 */
export const sendDrawResultEmail = async (to, name, matchType, prizeAmount) => {
  await sendEmail({
    to,
    subject: "🎉 You won in this month's draw!",
    html: baseTemplate(`
      <h2 style="color: #a8e6cf;">Congratulations, ${name}!</h2>

      <p style="color: #ccc; line-height: 1.6;">
        You matched a <strong style="color:#fff;">${matchType}</strong> 
        in this month's GolfHero draw.
      </p>

      <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
        <div style="font-size:14px;color:#888;">Prize Amount</div>
        <div style="font-size:36px;font-weight:bold;color:#a8e6cf;">
          ₹${prizeAmount.toLocaleString()}
        </div>
      </div>

      <p style="color:#ccc;">
        Please log in to upload verification proof to claim your prize.
      </p>

      <a href="${process.env.FRONTEND_URL}/dashboard/winnings"
        style="display:inline-block;margin-top:8px;padding:12px 28px;background:#2d6a4f;color:#fff;border-radius:8px;text-decoration:none;">
        Claim Prize
      </a>
    `),
  });
};

/**
 * ✅ Subscription Email
 */
export const sendSubscriptionEmail = async (to, name, plan, endDate) => {
  await sendEmail({
    to,
    subject: "Subscription Confirmed ✅",
    html: baseTemplate(`
      <h2 style="color:#a8e6cf;">Subscription Active, ${name}!</h2>

      <p style="color:#ccc; line-height:1.6;">
        Your <strong style="color:#fff;">${plan}</strong> plan is now active.
      </p>

      <p style="color:#888;font-size:14px;">
        Valid until: 
        <strong style="color:#fff;">
          ${new Date(endDate).toDateString()}
        </strong>
      </p>

      <a href="${process.env.FRONTEND_URL}/dashboard"
        style="display:inline-block;margin-top:16px;padding:12px 28px;background:#2d6a4f;color:#fff;border-radius:8px;text-decoration:none;">
        View Dashboard
      </a>
    `),
  });
};