const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const AdminModel = require("../models/adminModel");

const JWT_SECRET = process.env.JWT_SECRET || "shinn@!@#$%@2005";

exports.adminRegister = async (req, res) => {
  try {
    const { name, email, address, role, password } = req.body;

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Invalid email format" });
    }

    if (password.length < 12) {
      return res.status(400).json({
        isSuccess: false,
        message: "Password must be at least 12 characters long",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        isSuccess: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const existingAdmin = await AdminModel.findOne({ email });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = new AdminModel({
      name,
      email,
      address,
      role,
      password: hashedPassword,
    });

    await newAdmin.save();

    return res.status(201).json({
      isSuccess: true,
      message: "Admin created successfully",
    });
  } catch (error) {
    console.error("Error in adminRegister:", error);
    return res
      .status(500)
      .json({ isSuccess: false, message: error.message, error });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Invalid email format" });
    }

    const existingAdmin = await AdminModel.findOne({ email });

    if (!existingAdmin) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingAdmin.password
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: existingAdmin.email, id: existingAdmin._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      isSuccess: true,
      message: "Admin logged in successfully",
      data: existingAdmin,
      token,
    });
  } catch (error) {
    console.error("Error in adminLogin:", error);
    return res
      .status(500)
      .json({ isSuccess: false, message: error.message, error });
  }
};
