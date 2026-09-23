import Transaction from "../../models/Transaction";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpaySecret = process.env.RAZORPAY_SECRET;

const instance =
  razorpayKeyId && razorpaySecret
    ? new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpaySecret,
      })
    : null;

// console.log(process.env.RAZORPAY_KEY_ID,process.env.RAZORPAY_SECRET)

export const leadPayment = async (req: any, res: any) => {
  try {
    const { leadId, amount } = req.body;
    // console.log(req.body);
    if (!instance) {
      return res.status(503).json({ message: "Razorpay is not configured" });
    }

    if (!leadId || !amount) {
      return res.status(400).json({ message: "leadId and amount are required" });
    }

    const receiptId = 'receipt_order_' + Math.random().toString(36).substring(2, 15);

    const options = {
      amount: Number(amount) * 100, // in paise
      currency: 'INR',
      receipt: receiptId,
    };

    // console.log("Creating Razorpay Order with options:", options);

    const order = await instance.orders.create(options);

    // console.log('Razorpay Order:', order);

    // Save in DB after successful order creation
    const data = await Transaction.create({
      leadId: leadId,
      amount: amount,
      currency: 'INR',
      receipt: receiptId, // Use same receipt
      razorpayOrderId: order.id, // Save Razorpay Order ID too (best practice)
    });

    // console.log('Transaction Saved:', data);

    return res.status(200).json(order);

  } catch (err: any) {
    console.error("Payment Error:", err);
    return res.status(500).json({ message: "Error fetching Payment Details", error: err.message });
  }
};
