// Import the express express module and create the instance
const express = require("express");
const app = express();
// Authentication
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./middleware/authMiddleware');

// Enable the Cross-Origin Resource Sharing
const cors = require("cors");

// Import env variables from config
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

app.use(cors());
// Parse incoming JSON requests
app.use(express.json());
app.use(require("./routes/record"));

// get driver connection
const dbo = require("./db/conn");

// Mock user data (replace with actual database queries)
const users = [
  {
    id: 1,
    username: 'exampleAdmin',
    password: '$2a$12$oKD9oDqJlQ1j6xSnYSNfvO.gvtwlBIhe9mKqYfIyRdWTSAxhaT4Na', // bcrypt hash of 'admin'
    role: 'admin',
  },
  {
    id: 2,
    username: 'exampleUser',
    password: '$2a$12$da8HCP51I5Mk9vs0CbcgMeeatd1Npz8zQuRWvmPYnx5KLMFb7Ixv2', // bcrypt hash of 'user'
    role: 'user',
  },
];

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username (replace with actual database query)
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Compare the provided password with the stored hash
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expiration time
  });

  // Send the token in the response
  res.json({ token });
});

/*
// THIS IS ROUTE FOR SIGNUP
// Signup route
app.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;

  // Check if the username is already taken
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: 'Username is already taken.' });
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user object (replace with actual database insertion)
  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword,
    role: role || 'user', // Default role is 'user'
  };

  // Add the user to the mock database
  users.push(newUser);

  // Generate a JWT token
  const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expiration time
  });

  // Send the token in the response
  res.json({ token });
});
*/

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route!', user: req.user });
});

app.listen(port, () => {

  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
   });

  console.log(`Server is running on port: ${port}`);
});