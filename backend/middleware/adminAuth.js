const adminAuth = (req, res, next) => {
  const password = req.headers["x-admin-password"];

  if (!password) {
    return res
      .status(401)
      .json({ message: "Access Denied: No password provided." });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    next(); // Password is correct, proceed
  } else {
    return res
      .status(403)
      .json({ message: "Access Denied: Incorrect password." });
  }
};

module.exports = adminAuth;
