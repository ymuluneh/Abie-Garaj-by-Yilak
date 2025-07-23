const User = require("../services/userService");
const jwt = require("jsonwebtoken");

// ✅ Login controller with JWT token generation
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🚫 Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // ✅ Authenticate via userService
    const user = await User.loginUser(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // ✅ Generate token with relevant fields
    const token = jwt.sign(
      {
        employee_id: user.id,
        employee_email: user.email,
        employee_role: user.role,
        employee_first_name: user.first_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Return structure matching frontend expectation
    return res.status(200).json({
      message: "Login successful",
      employee: {
        employee_token: token,
        employee_id: user.id,
        employee_email: user.email,
        employee_role: user.role,
        employee_first_name: user.first_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { login };
