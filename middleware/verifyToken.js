const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let authHeader = req.headers.token;
  if (authHeader) {
    let token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json({ err });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("Token not found!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json("Access denied!");
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAuthorization };
