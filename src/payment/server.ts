import express, { Request, Response } from "express";
import Razorpay from "razorpay";

const app = express();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: "rzp_test_your_key_id_here", // Replace with your Razorpay Key ID
  key_secret: "your_key_secret_here", // Replace with your Razorpay Key Secret
});

app.use(express.json());

interface CreateOrderRequestBody {
  amount: number;
  orderId: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

app.post("/api/create-razorpay-order", async (req: Request<{}, {}, CreateOrderRequestBody>, res: Response) => {
  const { amount, orderId } = req.body;

  try {
    const options = {
      amount, // Amount in paise
      currency: "INR",
      receipt: `order_${orderId}`,
      notes: { orderId },
    };

    const order = await razorpay.orders.create(options) as RazorpayOrder;
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment: {
      entity: {
        notes: { orderId: string };
      };
    };
  };
}

app.post("/api/razorpay-webhook", express.raw({ type: "application/json" }), (req: Request<{}, {}, RazorpayWebhookPayload>, res: Response) => {
  const crypto = require("crypto");
  const secret = "your_webhook_secret_here"; // Replace with your Razorpay webhook secret

  const signature = req.headers["x-razorpay-signature"] as string;
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