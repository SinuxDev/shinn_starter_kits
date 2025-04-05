const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const AdminRepo = require("../repositories/authRepository");

const JWT_SECRET = process.env.JWT_SECRET || "shinn@!@#$%@2005";

exports.adminRegister = async (adminData) => {
  const { name, email, address, role, password } = adminData;

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (password.length < 12) {
    throw new Error("Password must be at least 12 characters long");
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }

  const existingAdmin = await AdminRepo.findByEmail(email);
  if (existingAdmin) {
    throw new Error("Admin already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newAdmin = {
    name,
    email,
    address,
    role,
    password: hashedPassword,
  };

  await AdminRepo.createdAdmin(newAdmin);
  return "Admin created successfully";
};

exports.adminLogin = async (email, password) => {
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  const existingAdmin = await AdminRepo.findByEmail(email);

  if (!existingAdmin) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    existingAdmin.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { email: existingAdmin.email, id: existingAdmin._id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    admin: existingAdmin,
  };
};
