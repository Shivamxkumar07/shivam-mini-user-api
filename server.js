const express = require("express");
const app = express();

// ================= SETUP =================
app.use(express.json());

let users = [];
let idCounter = 1;

// ================= MIDDLEWARE =================
app.use((req, res, next) => {
  const time = new Date().toLocaleString();
  console.log(`Request received at: ${time}`);
  console.log(`${req.method} ${req.url}`);
  next();
});

// ================= ROOT ROUTE =================
app.get("/", (req, res) => {
  res.json({
    message: "Server Running",
    time: new Date().toLocaleString(),
  });
});

// ================= USER ROUTES =================

// GET all users
app.get("/users", (req, res) => {
  res.json({
    message: "All users fetched",
    time: new Date().toLocaleString(),
    data: users,
  });
});

// POST add user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ // 400 Bad Request
      message: "Name and email required",
      time: new Date().toLocaleString(),
    });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ // 400 Bad Request
      message: "Email already exists",
      time: new Date().toLocaleString(),
    });
  }

  const newUser = {
    id: idCounter++,
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json({ // 201 Created
    message: "User added successfully",
    time: new Date().toLocaleString(),
    data: newUser,
  });
});

// DELETE user
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ // 404 Not Found
      message: "User not found",
      time: new Date().toLocaleString(),
    });
  }

  users.splice(index, 1);

  res.json({
    message: "User deleted successfully",
    time: new Date().toLocaleString(),
  });
});

// GET user by ID
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ // 404 Not Found
      message: "User not found",
      time: new Date().toLocaleString(),
    });
  }

  res.json({
    message: "User fetched",
    time: new Date().toLocaleString(),
    data: user,
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ // 400 Bad Request
      message: "All fields required",
      time: new Date().toLocaleString(),
    });
  }

  if (email === "admin@gmail.com" && password === "1234") {
    return res.json({
      message: "Login Success",
      time: new Date().toLocaleString(),
    });
  }

  res.status(401).json({ // 401 Unauthorized
    message: "Invalid Credentials",
    time: new Date().toLocaleString(),
  });
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
