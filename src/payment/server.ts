const express = require("express");
const Razorpay = require("razorpay");
const app = express();

// Initialize Razorpay with your key ID and secret
const razorpay = new Razorpay({
  key_id: "rzp_test_your_key_id_here", // Replace with your Razorpay Key ID
  key_secret: "your_key_secret_here", // Replace with your Razorpay Key Secret
});

app.use(express.json());

app.post("/api/create-razorpay-order", async (req, res) => {
  const { amount, orderId } = req.body; // Amount in paise, orderId from Supabase

  try {
    const options = {
      amount: amount, // Amount in paise (e.g., 50000 for ₹500)
      currency: "INR",
      receipt: `order_${orderId}`, // Unique receipt ID
      notes: { orderId }, // Attach orderId for reference
    };

    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id, // Razorpay order ID
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint (optional, for payment verification)
app.post("/api/razorpay-webhook", express.raw({ type: "application/json" }), (req, res) => {
  const crypto = require("crypto");
  const secret = "your_webhook_secret_here"; // Replace with your Razorpay webhook secret

  const signature = req.headers["x-razorpay-signature"];
  const body = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(body))
    .digest("hex");

  if (expectedSignature === signature) {
    const event = body.event;
    if (event === "payment.authorized") {
      const payment = body.payload.payment.entity;
      const orderId = payment.notes.orderId;
      console.log(`Payment authorized for order ${orderId}`);
      // Update Supabase order status here (e.g., to "paid")
    }
    res.status(200).json({ status: "ok" });
  } else {
    res.status(400).json({ error: "Invalid signature" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));