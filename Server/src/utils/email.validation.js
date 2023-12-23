import nodemailer from "nodemailer";
import { html } from "./email.html.js";
import { nanoid } from "nanoid";
import * as dotenv from "dotenv";
dotenv.config();

const sendEmail = async (data) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: `"Twitter" <${process.env.EMAIL}>`,
    to: data.email,
    subject: "Confirm Email",
    html: html({ code: data.code, name: data.name, message: emailMessage(data.emailType)}),
  });
};

const emailMessage = (emailType) => {
  const message = {
    register:"Thank you for signing up with our service! To complete your registration, please use the following verification code:",

    login:"Welcome to Twitter! We're excited to have you on board. To ensure the security of your account, please use the following verification code during your login:",

    forgetPassword:"We received a request to reset the password associated with this email address. If you made this request, Put this code to reset your password. If you didn't make this request, you can safely ignore this email.",
  };
  return message[emailType];
};
export default sendEmail;
