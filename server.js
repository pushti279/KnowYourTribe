const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..")));

// Define the User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  city: String,
  country: String,
  interests: [String],
  hobbies: [String],
  about: String,
  company: String,
  role: String,
  industry: String,
  experience: String,
  goals: [String],
  targetAudience: [String],
  challenges: [String]
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Registration route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address, city, country, interests, hobbies, about, company, role, industry, experience, goals, targetAudience, challenges } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      phone, 
      address, 
      city, 
      country, 
      interests, 
      hobbies, 
      about, 
      company, 
      role, 
      industry, 
      experience, 
      goals, 
      targetAudience, 
      challenges 
    });
    
    await user.save();
    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Return success response
    res.status(200).json({ 
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error during login" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

const port = 8205;

// MongoDB connection with better error handling
async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mydatabase");
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.log("\nTo fix this error:");
    console.log("1. Make sure MongoDB is installed on your system");
    console.log("2. Start MongoDB service");
    console.log("3. If using Windows, you can start MongoDB by running 'net start MongoDB' in an administrator command prompt");
    console.log("4. If using Linux/Mac, you can start MongoDB with 'sudo service mongod start'");
    process.exit(1);
  }
}

// Start the server only after MongoDB connection is established
connectToMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}); 