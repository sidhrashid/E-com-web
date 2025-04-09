const db = require("../../connection/Connection");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Temporary storage for OTPs (Consider using Redis for production)
const otpStore = new Map();
// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP
const sendOtp = async (req, res) => {
  try {
    const { email_or_phone } = req.body;
    if (!email_or_phone) {
      return res.status(400).json({ message: "Email is required." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    console.log(otp)

    otpStore.set(email_or_phone, { otp, expiresAt: Date.now() + 300000 }); // Store OTP for 5 minutes


    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Account Verification</h2>
      <p>Thank you for registering. Please use the following OTP to complete your signup process:</p>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This OTP is valid for 5 minutes only.</p>
      <p>If you didn't request this OTP, please ignore this email.</p>
    </div>
`

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email_or_phone,
      subject: "Your OTP Code",
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP." });
  }
};

// Register User
const registerNewUser = async (req, res) => {
  try {
    const { username, email_or_phone, password, otp } = req.body;
    console.log(req.body)
    if (!username || !email_or_phone || !password || !otp) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate OTP
    const storedOtp = otpStore.get(email_or_phone);
    if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }
    otpStore.delete(email_or_phone); // Remove OTP after verification

    // Check if user exists
    const checkUserQuery = "SELECT * FROM users WHERE username = ? OR email_or_phone = ?";
    db.query(checkUserQuery, [username, email_or_phone], async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error." });
      if (result.length > 0) {
        return res.status(400).json({ message: "Username or Email already exists." });
      }

      // Hash password & insert user
      const hashPassword = await bcrypt.hash(password, 10);
      db.query(
        "INSERT INTO users (username, email_or_phone, password, otp) VALUES (?, ?, ?, ?)",
        [username, email_or_phone, hashPassword, otp],
        (err) => {
          if (err) return res.status(500).json({ message: "Database error occurred." });
          return res.status(201).json({ message: "User registered successfully." });
        }
      );
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error occurred." });
  }
};

// User Login
const loginClientUser = async (req, res) => {
  try {
    const { email_or_phone, password } = req.body;
    if (!email_or_phone || !password) {
      return res.status(400).json({ message: "Email/phone and password are required." });
    }

    const query = "SELECT * FROM users WHERE email_or_phone = ?";
    db.query(query, [email_or_phone], async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error." });
      if (result.length === 0) return res.status(401).json({ message: "Invalid credentials." });

      const user = result[0];
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      return res.status(200).json({
        message: "Login successful.",
        user: {
          id: user.id,
          username: user.username,
          email_or_phone: user.email_or_phone,
          picture: user.picture || "https://i.pravatar.cc/100",
        },
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error occurred." });
  }
};

module.exports = { sendOtp, registerNewUser, loginClientUser };