import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  email: z.string().email("Nieprawidłowy adres email"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
