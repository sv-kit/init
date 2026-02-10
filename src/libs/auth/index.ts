import { getRequestEvent } from "$app/server";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { emailOTP } from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";

import { db } from "../db";
import * as table from "../db/tables/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: table.userTable,
      session: table.sessionTable,
      account: table.accountTable,
      verification: table.verificationTable
    }
  }),
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          console.log("email:", email);
          console.log("otp:", otp);
        }
      }
    }),
    sveltekitCookies(getRequestEvent)
  ]
});
