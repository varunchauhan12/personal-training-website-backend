// src/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/client/client.js";
import "dotenv/config";

// 1. Import the Postgres driver and Prisma adapter
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 2. Set up the connection pool and adapter
// (Make sure DATABASE_URL is defined in your .env)
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const authBaseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.AUTH_BASE_URL ||
  `http://localhost:${process.env.PORT || 5000}`;

// 3. Pass the adapter into the PrismaClient constructor
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  baseURL: authBaseURL,

  // Tell Better Auth to use your Prisma database
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Enable Standard Email/Password Logins
  emailAndPassword: {
    enabled: true,
  },

  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        // Enable Google OAuth only when configured
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),

  // Map your custom database fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
      },
    },
  },
});
