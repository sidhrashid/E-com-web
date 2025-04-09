const db = require("../../connection/Connection");
const bcrypt = require("bcryptjs");

// ===================================== (bcrypt.hash) =====================================

const addAdminUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required." });
    }

    const checkEmail =
      "SELECT * FROM admin_users WHERE username = ? OR email = ?";
    db.query(checkEmail, [username, email], async (err, result) => {
      if (err) {
        console.error("Database error:", err.message);
        return res
          .status(500)
          .json({ message: "Database error. Try again later." });
      }

      if (result.length > 0) {
        return res
          .status(400)
          .json({
            message: "Username Or Email already exists. Try another one!",
          });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const sqlQuery =
        "INSERT INTO admin_users (username, email, password) VALUES (?, ?, ?)";
      const data = [username, email, hashedPassword];

      db.query(sqlQuery, data, (err) => {
        if (err) {
          console.error("Database error:", err.message);
          return res
            .status(500)
            .json({ message: "Database query error. Please try again later." });
        }

        return res
          .status(201)
          .json({ message: "Admin User added successfully." });
      });
    });
  } catch (error) {
    console.error("Error adding user:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ===================================== (bcrypt.compare) =====================================

const loginAdminUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required." });
    }

    const sql = "SELECT * FROM admin_users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error("Database query error:", err.message);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      for (user of results) {
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          return res.status(200).json({ message: "Login successful" });
        }
      }
      return res.status(401).json({ message: "Invalid email or password" });
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ==================================== (show users api) ====================================
const getAdminUsers = (req, res) => {
  const sqlQuery = "SELECT * FROM admin_users";
  db.query(sqlQuery, (err, results) => {  
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }
    res.json({ results });
  });
};

// ==================================== (show users by id api) ====================================
const getAdminUsersById = (req, res) => {
  const { id } = req.params;
  const sqlQuery = "SELECT * FROM admin_users WHERE id = ?";
  db.query(sqlQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }
    res.json(results);
  });
};

// ==================================== (delete users api) ====================================
const deleteAdminUser = (req, res) => {
  const id = req.params.id;
  const q = "DELETE FROM admin_users WHERE id =?";
  db.query(q, id, (err) => {
    if (err) {
      return res.status(500);
    }
    return res.json(200);
  });
};

// ==================================== (update users api) ====================================

const updateAdminUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const sqlQuery =
    "UPDATE admin_users SET username = ?, email = ?, password = ? WHERE id = ?";
  const data = [username, email, hashedPassword, id];

  db.query(sqlQuery, data, (err) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({
        message: "Database query error. Please try again later.",
      });
    }

    return res.status(200).json({
      message: "User updated successfully.",
    });
  });
};



const updateStatus = ( (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE admin_users SET status = ? WHERE id = ?";
  db.query(query, [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: "User status updated successfully!" });
  });
});

module.exports = {
  addAdminUser,
  loginAdminUser,
  getAdminUsers,
  deleteAdminUser,
  getAdminUsersById,
  updateAdminUser,
  updateStatus
};
