const AdminModel = require("../models/adminModel");

exports.findByEmail = async (email) => {
  return await AdminModel.findOne({ email });
};

exports.createdAdmin = async (adminData) => {
  const newAdmin = new AdminModel(adminData);
  return await newAdmin.save();
};
