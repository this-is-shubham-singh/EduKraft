import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL_ID,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

const sendMail = async ({ email, subject, body }) => {
  try {
    const info = await transporter.sendMail({
      from: `"EDUKRAFT" <${process.env.SENDER_EMAIL_ID}>`,
      to: email,
      subject: subject,
      html: body,
    });
  } catch (e) {
    console.log("error occured while sending mail", e.message);
  }
};

export default sendMail;
