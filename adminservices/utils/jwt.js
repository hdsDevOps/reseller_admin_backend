const jwt = require("jsonwebtoken");


const generateToken = (payload, expiresIn = "1h") => {
  const secretKey = process.env.CRYPTOTOKEN; 

  if (!secretKey) {
    throw new Error("JWT secret key is not defined in environment variables");
  }

  return jwt.sign(payload, secretKey, { expiresIn });
};

module.exports = { generateToken };
