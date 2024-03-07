const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "success" });
});
app.post("/payment/create", async (req, res) => {
  const total = req.query.total;
  if (total > 0) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });
      console.log(paymentIntent);
      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({
        message: "Error creating payment intent",
      });
    }
  } else {
    res.status(403).json({
      message: "payment must be greater than zero",
    });
  }
});
app.listen(3500, (err) => {
  if (err) throw err;
  console.log("amazon server running on port, http://localhost:3500");
});
