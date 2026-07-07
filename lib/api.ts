import { BookingInput, CheckoutResponse } from "@/types/booking";

const API_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function createBooking(
  data: BookingInput
): Promise<CheckoutResponse> {
  const res = await fetch(`http://localhost:5000/api/booking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create booking");
  }

  return res.json();
}