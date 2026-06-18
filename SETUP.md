# Dunakeszi Masszázs – Setup Guide

## 1. Stripe API keys (your screenshot)

Your Google Apps Script **Script Properties** still have placeholder values:

| Property | Current (broken) | What to set |
|----------|------------------|-------------|
| `STRIPE_SECRET_KEY` | `sk_test_REPLACE_WITH_YOURS` | Real key from Stripe Dashboard |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_REPLACE_WITH_YOURS` | Real publishable key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_REPLACE_WITH_YOURS` | From webhook setup (step 2) |

### How to update

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers → API keys**
2. Copy **Publishable key** and **Secret key** (use Test mode first, then Live when ready)
3. Open [Google Apps Script](https://script.google.com) → your project → **⚙️ Project Settings → Script properties**
4. Click **Edit script properties** and paste the real values
5. Save

Until `STRIPE_SECRET_KEY` is real, card payments show: *"Invalid API Key provided"*.

---

## 2. Where is the webhook?

The webhook is **not** in Google Apps Script settings. It is configured in **Stripe Dashboard**, and it points **to** your Google Apps Script URL.

### Stripe webhook setup

1. [Stripe Dashboard](https://dashboard.stripe.com) → **Developers → Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL** (paste exactly):

```
https://script.google.com/macros/s/AKfycbyNNnfTYIlEcuJFD2DaHJcPkv-ErX34TRaxmuc3mFxLVksuoYqs4_GLhilMxHmS3Eg/exec
```

4. **Events to send:** select `checkout.session.completed`
5. Click **Add endpoint**
6. Open the new webhook → **Signing secret** → Reveal → copy `whsec_...`
7. Paste into Google Apps Script Script Properties as `STRIPE_WEBHOOK_SECRET`

### What the webhook does

```
Customer pays on Stripe
    → Stripe sends checkout.session.completed to your GAS URL
    → handleStripeWebhook() creates calendar booking + sends emails
```

Without this webhook, Stripe payments succeed but **no booking is created**.

---

## 3. Bank transfer flow (most used)

```
Customer clicks "Banki átutalással foglalok"
    → Booking saved as "awaiting_bank_transfer" in PendingBookings sheet
    → Customer gets email with reference ID (e.g. DM-20260618-A3F2)
    → You get email: "Új banki átutalásos foglalás"
    → Customer transfers money with reference in payment comment
    → You see it in bank account
    → Admin panel: dunakeszimasszazs.hu/#admin → Függőben → "Befizetés megerősítése"
    → Calendar + confirmation emails sent automatically
```

---

## 4. Update Google Apps Script code

After pulling latest code from GitHub:

1. Open `google-apps-script-complete.txt` in this repo
2. Copy **all** the code
3. Google Apps Script → select all → paste → **Save**
4. **Deploy → Manage deployments → Edit → New version → Deploy**
5. Ensure: Execute as **Me**, Who has access **Anyone**

---

## 5. Deploy website (Vercel)

The site lives in the `app/` folder. Vercel should use:

- **Root Directory:** `app`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Optional environment variables (Vercel → Settings → Environment Variables)

| Variable | Purpose |
|----------|---------|
| `VITE_SCRIPT_URL` | Google Apps Script URL (if it changes) |
| `VITE_ADMIN_PASSWORD` | Admin panel password (instead of default in code) |

---

## 6. Test checklist

### Bank transfer
- [ ] Book with bank transfer on dunakeszimasszazs.hu
- [ ] Customer sees reference ID on screen + gets email
- [ ] You get admin email at dunakeszimasszor@gmail.com
- [ ] Pending booking appears in admin → Függőben
- [ ] Click "Befizetés megerősítése" → calendar event + emails

### Stripe (after keys + webhook)
- [ ] Use test card `4242 4242 4242 4242`
- [ ] Redirects to Stripe Checkout
- [ ] After payment → success page
- [ ] Booking appears in admin + calendar
- [ ] Stripe Dashboard → Webhooks shows successful delivery

---

## 7. Admin panel

- URL: https://dunakeszimasszazs.hu/#admin
- Password: set via `VITE_ADMIN_PASSWORD` in Vercel, or default in code