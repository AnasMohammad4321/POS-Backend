const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const categoryRoute = require("./routes/catgeory-route");
const unitOfMeasureRoute = require("./routes/unitOfmeasure-route");
const productRoute = require("./routes/product-route");
const userRoute = require("./routes/user-route");
const cartRoute = require("./routes/cart-route");
const User = require("./model/User");
const bcrypt = require("bcryptjs");

let dotenv = require("dotenv").config();

const PORT = process.env.PORT || 5500;
const BASE_PATH = "http://localhost";

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.get("/createAdmin", async (req, res) => {
  try {
    let user = new User({
      username: "admin",
      password: await bcrypt.hash("Needforspeed_2011", 12),
      admin: true,
    });

    await user.save();
    res.status(201).json({ message: "Admin user created successfully!" });
  } catch (err) {
    console.error("Error creating admin user:", err.message);
    res.status(500).json({ message: "Failed to create admin user." });
  }
});

app.use("/category", categoryRoute);
app.use("/unit", unitOfMeasureRoute);
app.use("/product", productRoute);
app.use("/user", userRoute);
app.use("/cart", cartRoute);

app.get("/", async (req, res) => {
  return res.status(404).json({ message: "Error page not Found 404" });
});

mongoose
  .connect(process.env.MONGOPATH)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running at ${BASE_PATH}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });
