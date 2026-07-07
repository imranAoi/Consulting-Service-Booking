import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="container">
      <div className="status success">
        <h1>Payment Successful ✓</h1>
        <p>
          Your consulting session is confirmed. A confirmation email with your
          meeting link is on its way.
        </p>
        <Link href="/">Book another session</Link>
      </div>
    </main>
  );
}