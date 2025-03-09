import express, { Request, Response } from "express";
import Razorpay from "razorpay";
import * as crypto from "crypto";

const app = express();

const razorpay = new Razorpay({
  key_id: "YOUR_ACTUAL_KEY_ID",
  key_secret: "YOUR_ACTUAL_KEY_SECRET",
});

app.post("/api/create-razorpay-order", express.json(), async (req: Request<CreateOrderRequestBody>, res: Response) => {
  const { amount, orderId } = req.body;

  try {
    const options = {
      amount: amount * 100, // Convert to paise
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

app.post("/api/razorpay-webhook", express.raw({ type: "application/json" }), (req: Request<RazorpayWebhookPayload>, res: Response) => {
  const secret = "YOUR_WEBHOOK_SECRET";
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
      // Add your database update logic here
    }
    res.status(200).json({ status: "ok" });
  } else {
    res.status(400).json({ error: "Invalid signature" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

interface CreateOrderRequestBody {
  amount: number;
  orderId: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

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