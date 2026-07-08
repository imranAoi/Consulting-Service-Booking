# Consulting Service Booking

A small booking app where someone fills a form, pays for a consulting session with Stripe, and then automatically gets a Google Calendar event and a confirmation email once the payment goes through.

**Live:** https://consulting-service-booking-p33iknbnq.vercel.app

Flow: `User → Booking Form → Payment → Confirmation Email`

## What it does

You open the site, enter your name, email, phone and what you want to talk about, pick a time, and hit pay. That sends you to Stripe Checkout. Once the payment is confirmed, the backend (via a Stripe webhook) creates a calendar event for the session and emails you a confirmation. The calendar invite also lands in your inbox because you're added as an attendee.

Required fields on the form: **Name, Email, Phone, Meeting Agenda** (plus a preferred date/time).

## Tech

- **Frontend:** Next.js + TypeScript — deployed on **Vercel**
- **Backend:** Node.js + Express (ES modules) — deployed on **Render**
- **Payments:** Stripe Checkout + webhooks
- **Calendar:** Google Calendar API (OAuth2)
- **Email:** Brevo HTTP API (see note below on why not SMTP)

## How it's wired

```
Frontend form
  → POST /api/booking  →  backend creates a Stripe Checkout session
                          (booking details stored in the session metadata)
  → browser redirected to Stripe, user pays
  → Stripe fires webhook: checkout.session.completed  →  POST /api/webhook
        → create Google Calendar event (with the user as attendee)
        → send confirmation email
  → Stripe redirects the browser to /success
```

One thing worth knowing: the "Payment Successful" page and the calendar/email are two **separate** paths. The success page shows on Stripe's redirect. The calendar event and email happen in the webhook, on the server. So if the webhook isn't set up right, payment still succeeds but nothing else happens.

## Running locally

**Backend**
```bash
cd backend
npm install
cp .env.example .env     # fill in the values below
npm run dev              # runs on http://localhost:5000
```

**Frontend**
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev              # runs on http://localhost:3000
```

### Backend environment variables
```env
PORT=5000
CLIENT_URL=http://localhost:3000     # your frontend URL

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...      # from `stripe listen` locally, or the Dashboard in prod

# Google Calendar (OAuth2 — authenticate as yourself)
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_REFRESH_TOKEN=1//...

# Email (Brevo)
BREVO_API_KEY=xkeysib-...
FROM_EMAIL=you@example.com
FROM_NAME=Consulting
```

### Frontend environment variable
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Testing the webhook locally
Stripe needs to reach your local server, so run:
```bash
stripe listen --forward-to localhost:5000/api/webhook
```
Copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`, then do a test payment.

## Notes from building it

- **Email uses Brevo's HTTP API, not SMTP.** Render's free tier blocks outbound SMTP ports, so Nodemailer + Gmail would just time out in production. An HTTP email API goes over HTTPS and works fine.
- **Google Calendar uses OAuth2 with a refresh token**, not a service account. On a personal Gmail account a service account can't create Google Meet links or invite attendees cleanly, and getting one authorized turned out to be a pain. Authenticating as myself (OAuth2) means `calendarId` is just `primary` and Meet links work.
- **The Stripe webhook route uses the raw body and is registered before `express.json()`** — otherwise the signature check fails.

## Deployment

- Frontend → **Vercel** (`NEXT_PUBLIC_API_URL` points at the Render backend).
- Backend → **Render** (all the secret env vars live here). In production, the Stripe webhook endpoint is set in the Stripe Dashboard pointing at `https://<render-backend>/api/webhook`, and `CLIENT_URL` is set to the Vercel URL so the redirects and CORS line up.
