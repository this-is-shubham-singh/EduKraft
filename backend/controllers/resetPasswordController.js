import User from "../models/users.js";
import { v4 as uuidv4 } from "uuid";
import sendMail from "../utils/mailSender.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

const resetPassword = async (req, res) => {
  try {
    // get mail
    const { email } = req.body;

    // mail validation
    if (!email) {
      return res.json({ success: false, message: "enter valid mail" });
    }

    // if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "enter a valid mail" });
    }

    // generate link
    const newResetToken = uuidv4();

    user.resetToken = newResetToken;
    user.resetTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // send link on mail
    await sendMail(
      email,
      "Reset Password",
      `<a href="${process.env.FRONTEND_BASELINK}reset/${newResetToken}" target="_blank" style="color: #007bff; text-decoration: none;">
          Click here to reset your password
      </a>`
    );

    // return res
    return res.json({
      success: true,
      message: "password reset link sent on mail",
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

const setNewPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const authHeader = req.header("Authorization");
    const tokenParts = authHeader.split(" ");
    const resetToken =
      tokenParts.length === 2 && tokenParts[0].toLowerCase() === "bearer"
        ? tokenParts[1]
        : null;

    if (!resetToken) {
      return res.json({ success: false, message: "invalid link" });
    }

    if (!newPassword || !confirmPassword) {
      return res.json({ success: false, message: "invalid password" });
    }

    if (newPassword != confirmPassword) {
      return res.json({ success: false, message: "password doesn't match" });
    }

    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: new Date() },
    });
    if (!user) {
      return res.json({ success: false, message: "invalid or expired link" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return res.json({ success: true, message: "password reset successfull" });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

export { resetPassword, setNewPassword };
