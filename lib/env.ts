import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"] as const),
  SESSION_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  DATABASE_URL: z.string(),
});

const validEnv = schema.safeParse(process.env);

if (!validEnv.success) {
  throw new Error(validEnv.error.message);
}

export const ENV = validEnv.data;
