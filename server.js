require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Contact = require("./models/contact");

const app = express();

// ✅ FIXED CORS (ALLOW ALL - TESTING)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://webryxtechnologies_db_user:Webryxtechnologies%402026@cluster0.gmbkhlx.mongodb.net/contactDB?retryWrites=true&w=majority";

// ✅ POST API
app.post("/api/contact", async (req, res) => {
  try {
    console.log("Request received:", req.body);

    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, phone, service, message });

    await newContact.save();

    res.status(200).json({ message: "Saved successfully ✅" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET API
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error ❌", err);
  });