#!/usr/bin/env node
/**
 * Create (or update) an admin account for the /admin portal.
 *
 * The account lives in Supabase Auth and gets the "admin" role in the
 * public.user_roles table. Only accounts with that role can sign in to /admin
 * and read quote requests (enforced by the database's row-level security).
 *
 * Usage (run from the project folder):
 *
 *   SUPABASE_URL="https://<project>.supabase.co" \
 *   SUPABASE_SERVICE_ROLE_KEY="<service role key>" \
 *   ADMIN_EMAIL="you@example.com" \
 *   ADMIN_PASSWORD="<the password you want>" \
 *   npm run create-admin
 *
 * Running it again with the same email updates that account's password.
 *
 * The service role key is a secret: never commit it, never put it in a
 * VITE_* variable, and never use it in browser code.
 */
import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  fail("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (Supabase → Project Settings → API).");
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  fail("Set ADMIN_EMAIL and ADMIN_PASSWORD.");
}
if (ADMIN_PASSWORD.length < 12) {
  fail("ADMIN_PASSWORD must be at least 12 characters.");
}

const email = ADMIN_EMAIL.trim().toLowerCase();
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(target) {
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === target);
    if (match) return match;
    if (data.users.length < 200) return null;
  }
  return null;
}

async function main() {
  let user = await findUserByEmail(email);

  if (user) {
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (error) throw error;
    console.log(`✔ Updated password for existing account ${email}`);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (error) throw error;
    user = data.user;
    console.log(`✔ Created account ${email}`);
  }

  const { error: roleError } = await supabase
    .from("user_roles")
    .upsert(
      { user_id: user.id, role: "admin" },
      { onConflict: "user_id,role", ignoreDuplicates: true },
    );
  if (roleError) throw roleError;

  console.log(`✔ ${email} has the "admin" role. Sign in at <your-site>/admin\n`);
}

main().catch((err) => fail(err?.message ?? String(err)));
