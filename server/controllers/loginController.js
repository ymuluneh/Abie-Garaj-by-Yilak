const User = require("../services/userService");
const jwt = require("jsonwebtoken");

//write employee login controler
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Authenticate user
    const user = await User.loginUser(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ user_role: user.role, first_name: user.first_name, last_name: user.last_name }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};


module.exports = { login };
