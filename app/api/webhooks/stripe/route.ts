import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // TODO: Stripe webhook handler
  // Verify signature, process checkout.session.completed event
  return NextResponse.json({ received: true });
}
