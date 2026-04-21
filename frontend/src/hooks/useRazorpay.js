import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const useRazorpay = () => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (plan, onSuccess) => {
    setLoading(true);
    try {
      const { data } = await api.post("/payments/order", { plan });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "GolfHero",
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Subscription`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verify = await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            });
            toast.success("Subscription activated!");
            onSuccess && onSuccess(verify.data.user);
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: {},
        theme: { color: "#1a6b3c" },
        modal: { ondismiss: () => toast.info("Payment cancelled") },
      };

      const rz = new window.Razorpay(options);
      rz.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading };
};

export default useRazorpay;
