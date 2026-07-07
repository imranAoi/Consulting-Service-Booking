"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { createBooking } from "@/lib/api";
import { BookingInput } from "@/types/booking";

const initialState: BookingInput = {
  name: "",
  email: "",
  phone: "",
  agenda: "",
  startTime: "",
};

export default function BookingForm() {
  const [form, setForm] = useState<BookingInput>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { url } = await createBooking(form);
      window.location.href = url; // redirect to Stripe Checkout
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h1>Book a Consulting Session</h1>

      <label>
        Name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Phone
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Preferred Date & Time
        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Meeting Agenda
        <textarea
          name="agenda"
          rows={4}
          value={form.agenda}
          onChange={handleChange}
          required
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Redirecting to payment..." : "Proceed to Payment"}
      </button>
    </form>
  );
}