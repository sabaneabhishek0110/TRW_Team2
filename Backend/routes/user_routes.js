import express from "express";
import { saveUser, sendSMS, sendEmail } from "../controllers/UserController.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Invalid email").isEmail(),
    check("phone", "Phone must be 10 digits").isLength({ min: 10, max: 10 }),
  ],
  saveUser
);

router.post("/send-sms", sendSMS);
router.post("/send-email", sendEmail);

export default router;