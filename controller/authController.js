const AdminServices = require("../services/authServices");

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

    const { token, admin } = await AdminServices.adminLogin(email, password);

    return res.status(200).json({
      isSuccess: true,
      message: "Login successful",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        address: admin.address,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error in adminLogin:", error);
    return res
      .status(500)
      .json({ isSuccess: false, message: error.message, error });
  }
};
