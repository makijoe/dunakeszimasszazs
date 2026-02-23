# Dunakeszi Masszázs - Angyali Szalon
## Project Handover Document

---

## 1. PROJECT OVERVIEW

This is a complete massage business website with:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Google Apps Script (free, runs on Google Sheets)
- **Payment**: Stripe Checkout integration
- **Admin Panel**: Password-protected dashboard

**Website URL**: https://3gudwag2cborw.ok.kimi.link
**Admin Panel**: https://3gudwag2cborw.ok.kimi.link/#admin
**Admin Password**: `Edina2025!`

---

## 2. WHAT YOU HAVE

### 2.1 Website Features
- Hero section with call-to-action
- 10 massage services with descriptions
- Pricing table
- TV appearances section (RTL, TV2)
- Customer testimonials (Google reviews)
- Before/after photos for treatments
- Professional products showcase
- Organo Coffee section
- Online booking with payment
- Contact section

### 2.2 Booking System
- Customers select service, date, time
- Recurring bookings (weekly, biweekly, monthly)
- Automatic discounts:
  - 2-3 sessions: 5%
  - 4-5 sessions: 10%
  - 6+ sessions: 15%
- 20% deposit payment via Stripe
- Bank transfer option

### 2.3 Admin Dashboard
- Customer search by email
- Customer profiles with session history
- P&L (Profit & Loss) reporting
- Package management

---

## 3. FILE LOCATIONS

### 3.1 Website Files
```
/mnt/okcomputer/output/app/
├── src/
│   └── App.tsx          # Main website code (all sections)
├── public/images/       # All photos and logos
├── dist/                # Built website (deploy this)
└── index.html           # HTML template
```

### 3.2 Backend Files
```
/mnt/okcomputer/output/
├── google-apps-script-complete.txt    # Google Apps Script code
└── HANDOVER.md                        # This file
```

---

## 4. HOW TO UPDATE THE GOOGLE APPS SCRIPT

### Step 1: Open Google Apps Script
1. Go to https://script.google.com/home
2. Find your project (the one with the current URL)

### Step 2: Replace the Code
1. Open the script
2. Select ALL code (Ctrl+A)
3. Delete it
4. Open the file: `/mnt/okcomputer/output/google-apps-script-complete.txt`
5. Copy ALL the code
6. Paste into the script editor
7. Save (Ctrl+S)

### Step 3: Deploy
1. Click **Deploy** (top right)
2. Click **New deployment**
3. Click the gear icon ⚙️ next to "Type"
4. Select **Web app**
5. Configure:
   - **Description**: Any name (e.g., "v1.1")
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
6. Click **Deploy**
7. Click **Authorize access** (if asked) → Allow all permissions
8. **Copy the new Web App URL**

### Step 4: Update Website with New URL
1. Open `/mnt/okcomputer/output/app/src/App.tsx`
2. Find this line:
   ```typescript
   const SCRIPT_URL = 'https://script.google.com/macros/s/OLD_URL/exec';
   ```
3. Replace with your new URL
4. Save the file

### Step 5: Rebuild and Deploy Website
```bash
cd /mnt/okcomputer/output/app
npm run build
cp -r public/images dist/
```
Then deploy the `dist` folder.

---

## 5. HOW TO SWITCH TO LIVE STRIPE (REAL PAYMENTS)

### 5.1 Get Live Stripe Keys
1. Go to https://dashboard.stripe.com
2. Make sure you're in **Live mode** (toggle in top left)
3. Go to Developers → API keys
4. Copy your **Secret key** (starts with `sk_live_`)

### 5.2 Update Google Apps Script
1. Open your Google Apps Script
2. Find the Stripe section (around line 635):
   ```javascript
   // TEST MODE
   const STRIPE_SECRET_KEY = 'sk_test_...';
   
   // LIVE MODE
   // const STRIPE_SECRET_KEY = 'sk_live_...';
   ```
3. Comment out the test key
4. Uncomment the live key line
5. Replace `YOUR_LIVE_SECRET_KEY_HERE` with your actual live secret key
6. Save and redeploy

### 5.3 Update Website Stripe Key (if needed)
The website only uses the publishable key for display. To update:
1. Open `/mnt/okcomputer/output/app/src/App.tsx`
2. Find and update:
   ```typescript
   const STRIPE_PUBLIC_KEY = 'pk_live_YOUR_LIVE_PUBLISHABLE_KEY';
   ```

---

## 6. GOOGLE SHEETS STRUCTURE

The script automatically creates these sheets:

### Customers
| CustomerID | Name | Email | Phone | CreatedDate | TotalSessions | SessionsUsed | SessionsRemaining | TotalSpent | Notes |

### SessionPackages
| PackageID | CustomerID | CustomerName | PurchaseDate | ServiceType | SessionsPurchased | SessionsUsed | SessionsRemaining | OriginalPrice | DiscountPercent | DiscountAmount | FinalPrice | DepositPaid | Status | Notes |

### Bookings
| BookingID | CustomerID | CustomerName | Service | Date | Time | Status | PackageID | SessionNumber | CreatedDate | Notes |

### Financial
| TransactionID | Date | Type | CustomerID | CustomerName | Description | Amount | PaymentMethod | RelatedPackageID | Notes |

### PnL
Monthly summary for dashboard

### PendingBookings
Temporary storage for bookings awaiting payment

---

## 7. TROUBLESHOOTING

### "Hiba a Stripe checkout során" Error
- Check that your Stripe secret key is correct
- Make sure you're using the right key (test vs live)
- Check Google Apps Script logs: View → Logs

### Website not connecting to backend
- Verify the SCRIPT_URL in App.tsx matches your deployed script URL
- Make sure the script is deployed as "Web app" with "Anyone" access

### Admin panel not working
- Check that you're using the hash route: `/#admin`
- Default password: `Edina2025!`

---

## 8. QUICK REFERENCE

### Rebuild Website
```bash
cd /mnt/okcomputer/output/app
npm run build
cp -r public/images dist/
```

### Deploy Website
Deploy the `/mnt/okcomputer/output/app/dist` folder

### Update Script URL in Website
File: `/mnt/okcomputer/output/app/src/App.tsx`
Line: `const SCRIPT_URL = '...'`

### Change Stripe Keys
File: `/mnt/okcomputer/output/google-apps-script-complete.txt`
Lines: 635-640 (STRIPE_SECRET_KEY)

---

## 9. SUPPORT

If something breaks:
1. Check the Google Apps Script logs (View → Logs)
2. Check the browser console (F12 → Console)
3. Verify all URLs and keys are correct
4. Make sure the script is deployed with "Anyone" access

---

**Last Updated**: 2026-02-23
**Version**: 1.0
