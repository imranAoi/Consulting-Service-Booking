import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="container">
      <div className="status cancel">
        <h1>Payment Cancelled</h1>
        <p>Your booking was not completed. No charge was made.</p>
        <Link href="/">Try again</Link>
      </div>
    </main>
  );
}