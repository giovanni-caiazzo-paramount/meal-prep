/**
 * Environment Variables Configuration
 */

import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .default("https://placeholder.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default("placeholder-key"),
  LMSTUDIO_BASE_URL: z.string().default("http://127.0.0.1:1234"),
  LMSTUDIO_MODEL: z.string().default("local-model"),
  LMSTUDIO_API_KEY: z.string().default("lm-studio"),
  OPENAI_API_KEY: z.string().optional(),
});

const env = EnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  LMSTUDIO_BASE_URL: process.env.LMSTUDIO_BASE_URL,
  LMSTUDIO_MODEL: process.env.LMSTUDIO_MODEL,
  LMSTUDIO_API_KEY: process.env.LMSTUDIO_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
});

export default env;
