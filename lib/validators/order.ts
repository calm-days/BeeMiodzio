import { z } from "zod";

export const orderSchema = z.object({
  plan: z.enum(["eighth", "third", "full"]),
  addons: z.array(
    z.enum(["cameras", "scales", "gift_box", "premium_box", "honey_sample"])
  ),
  giftFor: z.string().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
