import express from "express";
import { getUserByEmail } from "../controllers/user.js";
import sendEmail from "../services/sendEmail.js";
import crypto from "crypto";

const router = express.Router();

// send password link
router.post("/", async (req, res) => {
  try {
    const user = await getUserByEmail(req);
    // console.log(user);
    if (!user)
      return res.status(409).send({ message: "Email is not Registered" });

    const randomString = crypto.randomBytes(20).toString("hex");
    //console.log("RS:",randomString);
    const randomStringExpires = Date.now() + 3600000;
    //console.log("RS:EX:",randomStringExpires);
    user.randomString = randomString;
    user.randomStringExpires = randomStringExpires;
    await user.save();

    const resetLink = `${process.env.FRONTEND_BASE_URL}/verifyRandomString/${randomString}`;

    // HTML content with a clickable button
    const htmlContent = `
    <p>Hello ${user.username},</p>
    <p>You have requested to reset your password. Click the button below to reset it:</p>
    <a href="${resetLink}">
      <button style="padding: 10px; background-color: #e8a678; color:#f3f3f3;    font-weight: 600; border: none; border-radius: 5px; cursor: pointer;">
        Reset Your Password
      </button>
    </a>

    <br/>
    <br/>

    <a href="${resetLink}">
      ${resetLink}
    </a>
  `;

    await sendEmail(
      user.email,
      "[^_^!] ABC GOLD - Password Reset",
      htmlContent
    );
    res.status(200).json({
      message: "Password reset link sent to your email ",
      randomString: randomString,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const forgotPassword = router;
