const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorize = async (req, res, next) => {
  const UNAUTHORIZED_MESSAGE = "Unauthorized";

  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res
        .status(401)
        .json({ isSuccess: false, message: UNAUTHORIZED_MESSAGE });
    }

    const token = extractToken(authHeader);

    if (!token) {
      return res
        .status(401)
        .json({ isSuccess: false, message: UNAUTHORIZED_MESSAGE });
    }

    const decodedToken = verifyToken(token);

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ isSuccess: false, message: UNAUTHORIZED_MESSAGE });
  }
};

const extractToken = (authHeader) => {
  const tokenArray = authHeader.split(" ");
  return tokenArray.length === 2 ? tokenArray[1] : null;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

module.exports = authorize;
