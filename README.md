
# BestTask — Task Marketplace Starter (Next.js 14 + TS)

**Region:** North Chicago + 40 miles (configurable)  
**Locales:** English (default), Spanish  
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind, Prisma (Postgres), NextAuth, Stripe (stubs), next-intl

## Quick Start
1) **Clone & install**
```bash
pnpm i   # or npm i / yarn
cp .env.example .env
```

2) **Database**
- Use Postgres (Supabase recommended). Put `DATABASE_URL` into `.env`.
- Run Prisma:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

3) **Auth**
- Fill email SMTP (or Google OAuth) in `.env`.
- NEXTAUTH_SECRET: generate with `openssl rand -base64 32`.

4) **Stripe (escrow model)**
- Add `STRIPE_SECRET_KEY` and webhook secret.
- `/api/stripe/checkout` is a placeholder; connect to `Payment`/`Contract` logic.

5) **Run**
```bash
pnpm dev
```
Go to http://localhost:3000

## Structure
- `src/app/` — marketing + role areas: `/client`, `/worker`, `/admin`
- `src/app/api/` — lightweight API routes (jobs stub + stripe stub)
- `prisma/schema.prisma` — roles, jobs, offers, contracts, payments, reviews, and NextAuth tables
- `src/i18n/` — English/Spanish messages (next-intl)
- `src/lib/` — Prisma client, NextAuth config

## Next Steps (fill in as you build)
- Replace in-memory JOBS with Prisma CRUD.
- Add geosearch (Mapbox) and filters.
- Add Offers -> Contract flow and escrow with Stripe Connect.
- Add chat (Socket.IO or Pusher), notifications, and KYC provider.
- Harden admin actions and RBAC, add audit logs.
- Deploy on Vercel + Supabase + Stripe.

---
Brand name: **BestTask** (you can change in `i18n` messages and `<title>`).


## Run with Docker (one command)
This will spin up Postgres, Mailhog (test email), and build+run the app:

```bash
docker compose up --build
```

- App: http://localhost:3000
- Mailhog (test inbox): http://localhost:8025
- Postgres: localhost:5432 (user: postgres / pass: postgres / db: besttask)

**First run** automatically runs `prisma migrate deploy`.  
To seed an admin user (optional):
```bash
docker compose exec web npx ts-node prisma/seed.ts
```

### Environment
Values are set in `docker-compose.yml`. For production, set real SMTP/Stripe keys and a strong `NEXTAUTH_SECRET`.


## Non‑developer step‑by‑step (local + live for clients)

### A) Run on your computer (easiest)
1) Install **Docker Desktop**.
2) Unzip the project; open a terminal in that folder.
3) Run: `docker compose up --build`
4) Open the app: http://localhost:3000
   - Post a job via **Client**.
   - Create a Stripe account via **Worker** (test mode).
   - See jobs in **Admin**.
5) Stop: press `Ctrl + C` in the terminal.

### B) Put it online so clients can use it (recommended)
**You will create 3 free accounts:** Vercel (hosting), Supabase (database), Stripe (payments).

1) **Supabase**
   - Create a new project → get the `DATABASE_URL` for Postgres.
   - In Supabase SQL editor, enable UUID if needed (optional).
   - Locally run: `npx prisma migrate deploy && npx prisma generate` (or use Docker entrypoint in production).
2) **Stripe (test mode)**
   - Create account → Developers → API keys. Copy **Secret key**.
   - Create a test **Express Connect** account later via the Worker onboarding button.
   - Grab **Webhook secret** if you add webhooks (optional for MVP).
3) **Mapbox** (optional but nice for maps/search)
   - Create account → get **Public token**.
4) **Vercel**
   - Import this repo (upload the folder to GitHub first, then “New Project” on Vercel).
   - Set **Environment Variables** in Vercel project:
     - `DATABASE_URL` ⇒ from Supabase
     - `NEXTAUTH_URL` ⇒ your Vercel URL (e.g. https://besttask.vercel.app)
     - `NEXTAUTH_SECRET` ⇒ generate with any strong random string
     - `EMAIL_*` ⇒ set real SMTP or use a service (e.g., Resend, Mailgun)
     - `STRIPE_SECRET_KEY` ⇒ from Stripe
     - `STRIPE_WEBHOOK_SECRET` ⇒ optional for now
     - `APP_DEFAULT_CITY=Chicago`
     - `APP_DEFAULT_AREA_KM=64`
     - `MAPBOX_TOKEN` ⇒ optional
   - Click **Deploy**.
5) **Domain (optional but recommended)**
   - Buy a domain (Namecheap/Cloudflare). In Vercel → Settings → Domains → add your domain → follow DNS instructions.
6) **Stripe Connect payout (escrow)**
   - As a worker, click **Start Stripe onboarding** → complete Express setup.
   - Admin (you) can **accept an offer** by calling `/api/contracts` (will be added to UI in next step).
   - Client pays → money held → platform keeps fee → remainder goes to worker.

### C) How clients “download and use”
- This is a **website** (works on phone instantly). Share your link (QR on flyers, Facebook, Google Business).
- On iPhone/Android: tap **“Add to Home Screen”** to install as an app icon (PWA-like experience).
- If you want real store apps: later we generate **React Native** apps (Expo), then publish to **Google Play** and **App Store**.

### D) What’s next (polish)
- Add login & roles enforcement on pages.
- Offers → Admin UI to **Accept** (create Contract).
- True map search with Mapbox autocomplete + markers.
- Webhooks for Stripe (status updates).
- Reviews/ratings UI.


## New features added
- **Admin → Accept & Pay** button: creates a Contract and redirects to **/checkout/[contractId]**.
- **Stripe Elements checkout** page to take payment (test mode).
- **Mapbox Autocomplete** on Client: pick address and auto-fill coordinates.

### Setup keys
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from Stripe
- `STRIPE_SECRET_KEY` — from Stripe (server side)
- `NEXT_PUBLIC_MAPBOX_TOKEN` — from Mapbox

### Flow
1) Client posts a job with address.
2) Worker sends an offer (enter Job ID on Worker page).
3) Admin opens Admin → **Accept & Pay** (creates Contract) → goes to Checkout.
4) Test card: 4242 4242 4242 4242, any future date, any CVC, any ZIP.


## Authentication & Roles
- Sign in: `/ (auth)/signin` — Email or Google.
- Protected pages:
  - `/client` — any signed-in user (post jobs).
  - `/worker` — only role WORKER.
  - `/admin` — only role ADMIN.
- Admin can set roles in **Admin → Set user role**.

## Stripe Webhooks
- Endpoint: `/api/stripe/webhook` (set `STRIPE_WEBHOOK_SECRET`).
- Updates `Payment.status` on `payment_intent.*` events.

## Mobile App (Expo)
- Folder: `mobile/BestTaskApp`
- Install Expo CLI, then:
  ```bash
  cd mobile/BestTaskApp
  npm i
  echo EXPO_PUBLIC_API_URL=http://YOUR_HOST:3000 > .env
  npm run start
  ```
- Android emulator uses `http://10.0.2.2:3000` for your local machine.


## MobilePro (WebView App)
- Folder: `mobile/BestTaskApp`
- Set `EXPO_PUBLIC_BASE_URL=https://YOUR_SITE` in `mobile/BestTaskApp/.env`
- Build with EAS:
  ```bash
  npm i -g eas-cli
  cd mobile/BestTaskApp
  npm i
  eas init
  eas build -p android --profile production   # AAB for Play Store
  eas build -p android --profile development  # APK for direct install
  eas build -p ios --profile production       # for TestFlight
  ```
- Submit:
  ```bash
  eas submit -p android --latest
  eas submit -p ios --latest
  ```
