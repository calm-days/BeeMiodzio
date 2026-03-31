import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  CLOUDINARY_URL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  CRON_SECRET: z.string().min(16).optional(),
  BEEHIVE_MONITORING_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
