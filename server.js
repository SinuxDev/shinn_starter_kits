const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const compression = require("compression");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 7000;
const limiter = require("./middleware/limiter");
const connectDB = require("./config/db");

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(limiter);
app.use(compression());

(async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const routesPath = path.join(__dirname, "routes");
    fs.readdirSync(routesPath).forEach((file) => {
      if (file.endsWith(".js")) {
        const route = require(path.join(routesPath, file));
        app.use("/api", route);
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB or starting server:", error);
    process.exit(1);
  }
})();
