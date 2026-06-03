import rateLimit from "express-rate-limit";

export const signinRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // limit each IP to 8 requests per windowMs
  message: { success: false, error: "Too many signin attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export default { signinRateLimiter };
