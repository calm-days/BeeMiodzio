"use server";

// import { orderSchema } from "@/lib/validators/order";

export async function createOrder(_formData: FormData) {
  // TODO: Validate with orderSchema
  // TODO: Create Stripe Checkout Session
  // TODO: Save order to database
  return { success: true };
}
