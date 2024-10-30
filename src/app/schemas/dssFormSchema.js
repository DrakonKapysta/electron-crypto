import { z } from "zod";

export const dssFormSchema = z.object({
  message: z.string().min(1, { message: "Message required." }),

  publicKey: z.string().nullable(),
});
