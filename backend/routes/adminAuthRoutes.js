import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/admin/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword)
      return res.status(500).json({ message: "Admin env not configured" });

    
    if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const hashed = await bcrypt.hash(adminPassword, 10);
    const ok = await bcrypt.compare(password, hashed);

    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { role: "admin", email: adminEmail },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
