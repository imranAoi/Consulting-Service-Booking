export interface BookingInput {
  name: string;
  email: string;
  phone: string;
  agenda: string;
  startTime: string;
}

export interface CheckoutResponse {
  url: string;
  id: string;
}