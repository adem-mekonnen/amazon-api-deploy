const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(
  cors({
    origin: "https://amazon-clone-by-adem.netlify.app",
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "succes" });
});
app.post("/payment/create", async (req, res) => {
  const total = req.query.total;
  if (total > 0) {
    //console.log("recieved total", total);
    //res.send(total);
    const paymentIntent = await stripe.paymentIntent.create({
      amount: total,
      currency: "usd",
    });
    console.log(paymentIntent);
    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } else {
    res.status(403).json({
      message: "payment must be greater than zero",
    });
  }
});
app.listen(3500, (err) => {
  if (err) throw err;
  console.log("amazon server runnig on port ,http://localhost:3500");
});
//exports.api = onRequest(app);
// Your routes and logic using Express go here...

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
