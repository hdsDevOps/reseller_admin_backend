const { admin } = require("../firebaseConfig");

authMiddleware = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res
      .status(401)
      .json({
        error: "No token provided",
        message: "Authentication token is required",
      });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     try {
//         const token = req.headers.token;
//         if (!token) {
//             return res.status(401).json({
//                 status: 401,
//                 message: 'Authentication token is required'
//             });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.adminId = decoded.admin_id;
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             status: 401,
//             message: 'Invalid token'
//         });
//     }
// };