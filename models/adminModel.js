const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  isRemove: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
    },
  },
  address: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "admin",
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = model("Admin", adminSchema);
