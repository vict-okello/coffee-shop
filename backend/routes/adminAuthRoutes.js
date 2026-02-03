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
    const staffEmail = process.env.STAFF_EMAIL;
    const staffPassword = process.env.STAFF_PASSWORD;

    if (!adminEmail || !adminPassword)
      return res.status(500).json({ message: "Admin env not configured" });

    const emailNorm = email.trim().toLowerCase();
    const adminEmailNorm = adminEmail.trim().toLowerCase();
    const staffEmailNorm = staffEmail ? staffEmail.trim().toLowerCase() : "";

    let role = "";
    let ok = false;

    if (emailNorm === adminEmailNorm) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      ok = await bcrypt.compare(password, hashed);
      role = "admin";
    } else if (staffEmailNorm && emailNorm === staffEmailNorm) {
      if (!staffPassword) {
        return res.status(500).json({ message: "Staff env not configured" });
      }
      const hashed = await bcrypt.hash(staffPassword, 10);
      ok = await bcrypt.compare(password, hashed);
      role = "staff";
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { role, email: role === "admin" ? adminEmail : staffEmail },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
