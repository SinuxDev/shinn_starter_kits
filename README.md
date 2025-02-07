# Own Starter Kits (Shinn)

## Overview

\***\* Shinn Starter Kits is a Node.js-based backend system and it uses **Express.js, MongoDB (via Mongoose), bcrypt, and JSON Web Token (JWT) authentication\*\*.

---

## Features

✅ Secure authentication using **bcrypt** for password hashing and **JWT** for token-based authentication  
✅ Role-based access control (Admin & Users)  
✅ CRUD operations for **products and categories**  
✅ Middleware-based **authorization** to protect API routes  
✅ MongoDB integration with **Mongoose ORM**  
✅ Structured routing with **auto-loading routes**  
✅ Uses **dotenv** for environment variables

---

## **Installation & Setup**

### **1. Clone the repository**

```bash
git clone https://github.com/SinuxDev/own_starter_kits
cd 3D_Printers_Projects
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Set Up Environment Variables**

Create a `.env` file in the root directory and add the following:

```env
PORT=7000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### **4. Start Server**

For development (using nodemon):

```bash
npm run dev
```

For production:

```bash
npm start
```

The server will run on `http://localhost:7000`

---

## **Project Structure**

```
Own Starter Kits (Shinn)
│── controllers/        # API request handlers
│── middleware/         # Authentication middleware
│── models/            # Mongoose schemas
│── routes/            # API route files
│── server.js          # Main server file
│── .env               # Environment variables
│── package.json       # Dependencies and scripts
│── README.md          # Project documentation
```

---

## **API Routes**

### **Authentication**

| Method | Endpoint             | Description        | Access  |
| ------ | -------------------- | ------------------ | ------- |
| POST   | `/api/auth/register` | Register new admin | Public  |
| POST   | `/api/auth/login`    | Login & get token  | Public  |
| POST   | `/api/auth/logout`   | Logout             | Private |

---

## **Middleware**

A middleware (`authMiddleware.js`) is used to **protect routes** and validate JWT tokens.

```javascript
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
```

---

## **Technologies Used**

- **Node.js** & **Express.js** - Backend framework
- **MongoDB & Mongoose** - NoSQL database & ORM
- **bcrypt** - Password hashing
- **jsonwebtoken (JWT)** - Authentication & authorization
- **dotenv** - Environment variables
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

---

## **Contributing**

Feel free to fork the repo and submit **pull requests**. For major changes, please open an issue first.

1. Fork the project
2. Create your feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

---

## **License**

This project is open source and available under the Shinn's Love.

---

## **Contact**

For issues or feature requests, open an issue on GitHub or contact:
📧 **aung.yehtet1738@gmail.com**

## Authors

- [@SinuxDev](https://www.github.com/SinuxDev)
