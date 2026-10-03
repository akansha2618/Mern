const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/CampusBitesDB")
  .then(() => console.log("MongoDB Connected to CampusBitesDB"))
  .catch((err) => console.error("Database connection failed:", err));

// 1. GET /food - Retrieve all food items
app.get("/food", async (req, res) => {
  try {
    const items = await mongoose.connection.db
      .collection("menu")
      .find()
      .toArray();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// 2. POST /orders - Add student order
app.post("/orders", async (req, res) => {
  try {
    const { name, rollNo, stream, item, qty, price } = req.body;

    const newBooking = {
      studentName: name,
      rollNumber: rollNo,
      course: stream,
      foodItem: item,
      quantity: Number(qty),
      totalAmount: Number(price) * Number(qty),
      orderedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    await mongoose.connection.db.collection("orders").insertOne(newBooking);
    res.status(201).json({ message: "Order placed successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error placing order" });
  }
});

// 3. GET /orders - Retrieve all placed orders
app.get("/orders", async (req, res) => {
  try {
    const orderHistory = await mongoose.connection.db
      .collection("orders")
      .find()
      .toArray();
    res.status(200).json(orderHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.listen(PORT, () => {
  console.log(`Server live on http://localhost:${PORT}`);
});