import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({
        success: false,
        message: "unauthorized user, Login....",
      });
    }

    const payload = await jwt.verify(token, process.env.SECRET_KEY);
    if (!payload) {
      return response.json({
        success: false,
        message: "unauthorized user, Login....",
      });
    }

    req.user = payload;

    next();
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

export default auth;
