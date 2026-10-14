# Handover notes for deployment

This file is for whoever reviews and deploys the site. It explains what changed,
what needs to be set up, and how to create the admin account.

## What changed

Two commits on top of `06d4d58`:

1. **Bug fixes**
   - Consultation bookings were never saved. They are now stored in `quote_requests` with `occasion = "Consultation Booking"`.
   - Booking dates were off by one day before 8:00 AM Philippine time (UTC conversion).
   - The Google Calendar link always used 9:30 AM. It now uses the selected slot and meeting length.
   - Admin logo download used a public URL on a private bucket. It now uses a signed URL.
   - The quote draft could be overwritten on page load.
   - The catalog, inventory, and stock state had several problems:
     - hydration mismatches;
     - side effects inside React state updaters;
     - mutation of the default catalog;
     - stale image URLs after redeploys;
     - stale `useMemo` dependencies.
   - Out-of-stock items were labelled "in stock".
   - The product popup content overlapped and could not scroll on short screens (`auto-rows-max` on dialogs).
   - Email format is now validated on the quote form.
   - `process.env` access is guarded in the browser Supabase client.
   - Admin image uploads are resized before saving to localStorage.
   - The missing `public/placeholder.svg` was added.
   - TypeScript errors are fixed: `tsc --noEmit` is clean, and `eslint` is clean apart from Prettier formatting.
2. **Admin login and catalog PDF**
   - Removed the hard-coded demo credentials, the "One-Click Quick Access" button, the on-screen password hint, and the sample leads.
   - `/admin` now signs in with Supabase Auth only. After sign-in, the page checks `has_role(uid, 'admin')`. Accounts without the role are signed out.
   - The page has `noindex`.
   - Removed the "Staff Portal Sign In" link from the footer. The admin page is still at `/admin`.
   - Added the catalog PDF at `public/JJT_Product_Catalog_2026.pdf`.
     - `src/lib/brochure.ts` points to it.
     - The old link only worked on Lovable hosting.
   - Added `scripts/create-admin.mjs` (`npm run create-admin`).

No visual design was changed except removing the footer link and the demo/credentials box on the login screen.

## Build and run

```bash
npm ci
npm run dev        # local dev server
npm run build      # production build -> .output/
```

- The build uses `@lovable.dev/vite-tanstack-config`. It produces a **Cloudflare Workers** bundle (Nitro preset `cloudflare-module`, see `.output/nitro.json`).
- To deploy to Cloudflare: `npx wrangler --cwd .output deploy`.
- To host somewhere else, change the Nitro preset.
- `npm run preview` does **not** work with this build: it looks for `dist/server/server.js`. Use `npx wrangler --cwd .output dev` to preview the production build.

## Supabase setup

The app needs these environment variables at build time:

| Variable | Notes |
|---|---|
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable (anon) key. Safe to expose. |
| `VITE_SUPABASE_PROJECT_ID` | Project ref |

`SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are also read on the server as a fallback.

**Note:** `.env` is committed and points to the Lovable Cloud Supabase project (`*.lovable.cloud`). If you move to your own Supabase project:

1. Apply the migrations in `supabase/migrations/` (e.g. `supabase db push`).
2. Create a **private** storage bucket named `quote-logos`. The migrations add its policies but do not create the bucket.
3. Update the env vars above. Preferably set them in the host's environment and remove `.env` from git.

## Create the admin account

Only accounts with the `admin` role in `public.user_roles` can use `/admin`, and RLS enforces the same rule for reading quote requests and logos. The site owner will give you the email and password to use.

```bash
SUPABASE_URL="https://<project>.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<service role key>" \
ADMIN_EMAIL="<owner email>" \
ADMIN_PASSWORD="<owner password>" \
npm run create-admin
```

- The script creates the user with the email already confirmed and grants the `admin` role.
- Running it again for the same email resets that password.
- The service role key is secret. Do not commit it or expose it to the browser.

**Alternative (dashboard):**

1. In Supabase, go to Authentication → Users → Add user, enter the email and password, and tick "Auto confirm".
2. Run this SQL:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = '<owner email>'
on conflict (user_id, role) do nothing;
```

Also consider disabling public sign-ups in Supabase Auth settings. The site doesn't use them.

## Checks after deploying

- Submit a quote on `/build`. It should appear in `/admin`, and the logo download should work.
- Book a consultation. It should appear in `/admin` as "Consultation Booking".
- The "Download 2026 Catalog (PDF)" buttons on `/` and `/catalog` should download the 22-page PDF.
- `/admin` should reject wrong passwords and accounts without the admin role.

## Known limitations (not changed)

- Catalog and inventory edits made in `/admin` are saved in **that browser's localStorage only**. Visitors and other staff do not see them. Making them shared needs database tables.
- The admin lead view does not display the customer's chosen type, size, or color, although they are saved in `items`.
- The booking confirmation text says an invitation email was sent. No email is sent.
- Contact details on the website (`company` in `src/lib/catalog.ts` and the footer) differ from the PDF catalog. The owner should confirm which are correct.
