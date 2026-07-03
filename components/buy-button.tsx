"use client";

import { useState } from "react";
import Script from "next/script";
import { createRazorpayOrder } from "@/app/actions/razorpay";
import { CreditCard } from "lucide-react";

interface BuyButtonProps {
  amount: number;
  itemName: string;
}

export function BuyButton({ amount, itemName }: BuyButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const { success, order } = await createRazorpayOrder(amount);
      
      if (!success || !order) {
        alert("Server error. Please try again.");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: "ProjectsKatta",
        description: `Payment for ${itemName}`,
        order_id: order.id,
        handler: function (response: any) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#09090b",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment Failed! " + response.error.description);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-zinc-950 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-800 transition disabled:bg-zinc-400"
      >
        <CreditCard className="w-4 h-4" />
        {isProcessing ? "Processing..." : "Buy Now"}
      </button>
    </>
  );
}