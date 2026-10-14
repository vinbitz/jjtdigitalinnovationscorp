# Automating bookings, lead alerts and follow-ups

## How it works today

**Quote form (`/build`)**
- Saves a row in `quote_requests`, and the customer's logo goes to the `quote-logos` bucket.
- **Nobody is notified.** Staff must open `/admin` to see new leads.

**"Schedule a Consultation"**
- Saves a row in `quote_requests` with `occasion = "Consultation Booking"`. The date and time are stored in `notes`.
- **No email or calendar invite is sent.**
- Time slots are fixed, with no availability check, so double bookings are possible.
- The confirmation screen and toast say an invitation was sent. That text is not true yet.
- The customer only gets an "Add to Google Calendar" link.

## What the owner needs to provide or decide

1. **Email sending service.** Choose one: Resend (simplest), Postmark, SendGrid or Amazon SES. Create the account and provide the API key.
2. **DNS access for `jjt-digital.com`.** It's needed to verify the sending domain with SPF, DKIM and DMARC records. Without it, emails will land in spam.
3. **Who gets lead alerts.** For example `sales@jjt-digital.com`, plus any CC addresses. Optionally also a phone alert by Viber, Telegram or Slack.
4. **Calendar to book into.**
   - The Google Workspace (or other) account that owns meetings.
   - Working days and hours.
   - Meeting lengths: 30 and 45 minutes, as on the website.
   - Buffer time between meetings and holidays.
   - Who attends.
5. **Scheduling approach:**
   - **A. Calendly or Cal.com (fastest, least code).** It handles availability, Google Meet links, invites, reminders and rescheduling. The site already supports a link: set `schedulingUrl` in `src/lib/scheduling.ts`.
   - **B. Keep the website's own booking form.** This needs Google Calendar API access, described below.
6. **Email wording.** Write the customer quote auto-reply, the booking confirmation, the reminder, and the internal lead alert.
7. **Privacy.** Under the Philippine Data Privacy Act (RA 10173), add a privacy notice and consent checkbox on both forms. Decide how long to keep lead data.
8. **Supabase owner access.** The project is currently on Lovable Cloud. Confirm who owns it, or move to your own Supabase project.

## What the engineer sets up

### 1. Lead alerts and auto-replies

- Create a Supabase **Edge Function** (e.g. `notify-lead`). Trigger it with a **Database Webhook** on `INSERT` into `quote_requests`.
- The function sends:
  - an internal alert with all lead details, a link to `/admin`, and a signed link to the logo;
  - an auto-reply to the customer, e.g. "we received your request, we reply within 24 hours".
- Store these as Edge Function secrets: email API key, `SALES_EMAIL`, `SITE_URL`.

### 2. Real meeting invitations

**Option A (Calendly / Cal.com)**
- Connect it to Google Calendar and Google Meet.
- Put the link in `src/lib/scheduling.ts`.
- Point the "Schedule" buttons to it, or embed it.

**Option B (own form)**
- Add a `bookings` table with real `start_at`/`end_at` columns and a unique slot constraint, so the same slot can't be booked twice.
- Add an Edge Function that:
  1. checks Google Calendar free/busy;
  2. creates the event with a Google Meet link (`conferenceData`) and `sendUpdates=all`, which invites the customer and staff;
  3. returns the result to the booking form.
- Google access needs one of:
  - a Google Workspace service account with domain-wide delegation;
  - an OAuth refresh token for the sales calendar.
- Show only free slots in the form.
- Change the confirmation text so it reflects what really happened.
- Add 24-hour and 1-hour reminder emails with a scheduled function (Supabase cron).

### 3. Spam and abuse protection (do this before sending any automatic emails)

- **CAPTCHA:** add Cloudflare Turnstile or hCaptcha on both forms and verify it on the server. Otherwise bots can make the site send emails to anyone.
- **Rate limiting:** limit submissions per IP or email.
- **Logo uploads:** set a size limit and allowed file types on the `quote-logos` bucket.

### 4. Admin improvements for handling leads

- Show the customer's chosen type, size and color. It is saved in `items`, but the admin doesn't display it yet.
- Track a status flow: new → contacted → quoted → won/lost. Optionally add "reply by email" buttons using templates.

### 5. Production basics

- Put Supabase on a paid plan. Free projects can be paused when inactive and have limited backups.
- Add error monitoring (e.g. Sentry) and uptime monitoring.
- Set up the custom domain and HTTPS on the host.
- Disable public sign-ups in Supabase Auth.
- Create the admin account (see `HANDOFF.md`).
