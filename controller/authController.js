const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const AdminModel = require("../models/adminModel");
const AdminServices = require("../services/authServices");

const JWT_SECRET = process.env.JWT_SECRET || "shinn@!@#$%@2005";

exports.adminRegister = async (req, res) => {
  try {
    const message = await AdminServices.adminRegister(req.body);
    res.status(201).json({ isSuccess: true, message });
  } catch (error) {
    res.status(400).json({ isSuccess: false, message: error.message });
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
