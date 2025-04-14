const db = require("../../connection/Connection");
const bcrypt = require("bcryptjs");

// ===================================== Add Admin User =====================================
const addAdminUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required." });
    }

    const checkEmail = "SELECT * FROM admin_users WHERE username = $1 OR email = $2";
    db.query(checkEmail, [username, email], async (err, result) => {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).json({ message: "Database error. Try again later." });
      }

      if (result.rows.length > 0) {
        return res.status(400).json({
          message: "Username or Email already exists. Try another one!",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const sqlQuery = "INSERT INTO admin_users (username, email, password) VALUES ($1, $2, $3)";
      const data = [username, email, hashedPassword];

      db.query(sqlQuery, data, (err) => {
        if (err) {
          console.error("Database error:", err.message);
          return res.status(500).json({ message: "Database query error. Please try again later." });
        }

        return res.status(201).json({ message: "Admin User added successfully." });
      });
    });
  } catch (error) {
    console.error("Error adding user:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ===================================== Login =====================================
const loginAdminUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const sql = "SELECT * FROM admin_users WHERE email = $1";

    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error("Database query error:", err.message);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.rows.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return res.status(200).json({ message: "Login successful" });
      }

      return res.status(401).json({ message: "Invalid email or password" });
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ===================================== Get All Users =====================================
const getAdminUsers = (req, res) => {
  const sqlQuery = "SELECT * FROM admin_users";
  db.query(sqlQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }
    res.json({ results: results.rows });
  });
};

// ===================================== Get User By ID =====================================
const getAdminUsersById = (req, res) => {
  const { id } = req.params;
  const sqlQuery = "SELECT * FROM admin_users WHERE id = $1";
  db.query(sqlQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results.rows[0]);
  });
};

// ===================================== Delete User =====================================
const deleteAdminUser = (req, res) => {
  const { id } = req.params;
  const q = "DELETE FROM admin_users WHERE id = $1";
  db.query(q, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete user." });
    }
    return res.status(200).json({ message: "User deleted successfully." });
  });
};

// ===================================== Update User =====================================
const updateAdminUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const sqlQuery =
    "UPDATE admin_users SET username = $1, email = $2, password = $3 WHERE id = $4";
  const data = [username, email, hashedPassword, id];

  db.query(sqlQuery, data, (err) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ message: "Database query error. Please try again later." });
    }

    return res.status(200).json({ message: "User updated successfully." });
  });
};

// ===================================== Update Status =====================================
const updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE admin_users SET status = $1 WHERE id = $2";
  db.query(query, [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: "User status updated successfully!" });
  });
};

module.exports = {
  addAdminUser,
  loginAdminUser,
  getAdminUsers,
  deleteAdminUser,
  getAdminUsersById,
  updateAdminUser,
  updateStatus,
};
