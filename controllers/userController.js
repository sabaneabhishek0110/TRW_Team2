import User from "../models/User.js";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
import twilio from "twilio";
import { configDotenv } from "dotenv";
import { getEmailTemplate } from "../utils/getEmailTemplate.js";
import { getSMSTemplate } from "../utils/getSMSTemplate.js";

configDotenv();
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
const twilioPhone = process.env.TWILIO_PHONE;

export const saveUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, phone } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists." });

    const user = new User({ name, email, phone });
    await user.save();
    res.status(201).json({ msg: "User saved", user });
  } catch (err) {
    console.error("Error saving user:", err.message);
    res.status(500).send("Server Error");
  }
};

export const sendSMS = async (req, res) => {
  const { phone, alertType, value } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user)
      return res.status(404).json({ msg: "User with this phone not found" });

    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
    const twilioPhone = process.env.TWILIO_PHONE;

    const body = getSMSTemplate(alertType, { value });

    const sms = await client.messages.create({
      body,
      from: twilioPhone,
      to: `+91${phone}`,
    });

    res.status(200).json({ msg: "SMS sent", sid: sms.sid });
  } catch (err) {
    console.error("SMS Error:", err.message);
    res.status(500).send("Failed to send SMS");
  }
};

export const sendEmail = async (req, res) => {
  const { email, alertType, value, machine_number } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ msg: "User with this email not found" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const { subject, html } = getEmailTemplate(alertType, { value });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject,
      html,
    });

    res.status(200).json({ msg: "Alert email sent" });
  } catch (err) {
    console.error("Email Error:", err.message);
    res.status(500).send("Failed to send Email");
  }
};
