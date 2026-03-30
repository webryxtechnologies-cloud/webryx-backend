console.log("JS loaded");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Contact = require("./models/contact");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("process.env.MONGODB_URI")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// POST - Save form data
app.post("/api/contact", async (req, res) => {
  try {
    console.log("Request received:", req.body);

    const { name, email, phone, service, message } = req.body;

    // Validation check
    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      service,
      message,
    });

    await newContact.save();

    console.log("Data saved to MongoDB");

    res.status(200).json({ message: "Saved successfully" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET - Fetch all contacts (NEW FEATURE)
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("API is working ");
});

// Server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});