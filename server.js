require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Contact = require("./models/contact");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.post("/api/contact", async (req, res) => {
  try {
    console.log("Request received:", req.body);

    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, phone, service, message });

    await newContact.save();

    res.status(200).json({ message: "Saved successfully" });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/contacts", async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

app.get("/", (req, res) => {
  res.send("API is working");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));