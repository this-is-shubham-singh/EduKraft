import User from "../models/users.js";
import otpGenerator from "otp-generator";
import sendMail from "../utils/mailSender.js";
import TempVerifyEmail from "../models/tempVerifyEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tempVerifyEmailModel from "../models/tempVerifyEmail.js";

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
      !accountType
    ) {
      return res.json({ success: false, message: "enter all data" });
    }

    // check if user already exist
    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        success: false,
        message: "email already in use or pending verification",
      });
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
      otpExpiresAt: Date.now() + 5 * 60 * 1000,
    });

    // send mail with otp
    await sendMail(
      email,
      "Verify Email",
      `<h2>Your email verification otp is ${otp}</h2>`
    );

    return res.status(200).json({
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

    // extract saved otp and compare
    const user = await TempVerifyEmail.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user doesn't exist" });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "otp expired" });
    } else if (user.otp !== otp) {
      return res.json({ success: false, message: "invalid otp" });
    }

    // set data to user and delete from tempVerifyEmailModel
    await User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      accountType: user.accountType,
    });

    const response = await TempVerifyEmail.findByIdAndDelete(user._id);

    return res.status(200).json({
      success: true,
      message: "email verified",
    });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

// login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "invalid data",
      });
    }

    // find if user doesnt exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "invalid user",
      });
    }

    // password comparison
    const response = await bcrypt.compare(password, user.password);
    if (!response) {
      return res.json({
        success: false,
        message: "invalid email id or incorrect password",
      });
    }

    // creating jwt token
    const payload = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    };
    const token = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    // create cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: process.env.ENVIRONMENT === "production" ? "strict" : "Lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.json({
      success: true,
      message: "user logged in ",
    });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

// change password
const changePassword = async () => {
  try {
    const { id } = req.body;
  } catch (e) {}
};

export { signup, signup, verifyEmail, login, changePassword };
