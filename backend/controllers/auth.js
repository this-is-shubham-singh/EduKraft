import User from "../models/users.js";
import otpGenerator from "otp-generator";
import sendMail from "../utils/mailSender.js";
import TempVerifyEmail from "../models/tempVerifyEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// signup
const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      createPassword,
      confirmPassword,
      accountType,
    } = req.body;

    // validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !createPassword ||
      !confirmPassword ||
      accountType
    ) {
      return res.json({ success: false, message: "enter all data" });
    }

    // check if user already exist
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "user already exist" });
    }

    // compare both passwords
    if (createPassword != confirmPassword) {
      return res.json({ success: false, message: "password does not match" });
    }

    // hash the password
    const hashedPass = await bcrypt.hash(confirmPassword, 10);

    // generate otp
    const otp = await otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // save data to temp model
    const newUser = await TempVerifyEmail.create({
      firstName,
      lastName,
      email,
      password: hashedPass,
      accountType,
      otp,
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // send mail with otp
    await sendMail(
      email,
      "Verify Email",
      `<h2>Your email verification otp is ${otp}</h2>`
    );

    return res.json({
      success: true,
      message: "verify otp sent to mail",
      email: newUser.email,
    });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

// verify email
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.json({ success: false, message: "invalid data" });
    }

    TempVerifyEmail.findOne({ email });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

// login
const login = async () => {};

// change password
const changePassword = async () => {};

export { signup, signup, verifyEmail, login, changePassword };
