"use server";

import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(amount: number) {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay takes amount in paise
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });
    
    return { success: true, order };
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return { success: false, error: "Payment initiation failed" };
  }
}