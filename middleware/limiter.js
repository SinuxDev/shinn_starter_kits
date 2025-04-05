const limitRate = require("express-rate-limit");

const limiter = limitRate({
  windowMs: 1 * 60 * 1000,
  limit: 15,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

module.exports = limiter;
