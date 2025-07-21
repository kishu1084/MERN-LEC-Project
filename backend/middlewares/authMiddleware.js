const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ message: "Admin access required" });

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const adminProtect = (req, res, next) => {
  protect(req, res, () => {
      if (req.user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
      }
      next();
  });
};

module.exports = {protect, adminProtect};
