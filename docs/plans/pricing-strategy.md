# FabricFit — Pricing Strategy & Implementation Reference

---

## 1. Credit Economics

| API Action | Credits | Your API Cost | Starter (₹25/try-on) | Pro (₹22.50) | Business (₹20) |
|---|---|---|---|---|---|
| Fast try-on (default) | 2 | ₹12.50 | ₹25 | ₹22.50 | ₹20 |
| Detailed try-on | 3 | ₹18.75 | ₹37.50 | ₹33.75 | ₹30 |
| Catalogue page render | 2–3 | ₹12.50–18.75 | not billed separately | not billed separately | not billed separately |

> Catalogue generation uses the API but is **not deducted from the user's credit pool**. It is a flat feature limited only by the monthly export count per plan. You absorb the catalogue API cost as part of the plan margin.

---

## 2. Subscription Plans

### Starter — ₹2,500/month

| Feature | Detail |
|---|---|
| Credits | 200 / month |
| Approx. try-ons (fast mode) | 60–80 |
| Effective rate | ₹25 / try-on |
| Gross margin on credits | ~50% |
| Branches | 1 |
| Catalogue exports | 10 / month |
| Fabric + outfit storage | 200 items |
| Try-on history | 30 days |
| FabricFit watermark | Yes (removable — see Add-ons) |
| Support | Email |
| Web dashboard | No |
| Analytics | No |

---

### Pro — ₹4,500/month

| Feature | Detail |
|---|---|
| Credits | 400 / month |
| Approx. try-ons (fast mode) | 120–160 |
| Effective rate | ₹22.50 / try-on |
| Gross margin on credits | ~44% |
| Branches | Up to 3 (separate login + separate credit allocation) |
| Catalogue exports | 50 / month |
| Fabric + outfit storage | 500 items |
| Try-on history | 90 days |
| FabricFit watermark | Removed |
| Support | Priority email |
| Web dashboard | No |
| Analytics | No |

---

### Business — ₹10,000/month

| Feature | Detail |
|---|---|
| Credits | 1,000 / month |
| Approx. try-ons (fast mode) | 300–400 |
| Effective rate | ₹20 / try-on |
| Gross margin on credits | ~37.5% |
| Branches | Unlimited |
| Catalogue exports | 100 / month |
| Fabric + outfit storage | Unlimited |
| Try-on history | 1 year |
| FabricFit watermark | Removed |
| Support | Dedicated account manager |
| Web dashboard | Yes — mass upload fabrics/outfits, distribute across branches, assign branch credits |
| Analytics | Usage per branch, popular fabrics, daily/weekly try-on volume |

---

### Annual Pricing (2 months free)

| Plan | Monthly | Annual (pay 10, get 12) | Effective/month |
|---|---|---|---|
| Starter | ₹2,500 | ₹25,000 | ₹2,083 |
| Pro | ₹4,500 | ₹45,000 | ₹3,750 |
| Business | ₹10,000 | ₹1,00,000 | ₹8,333 |

---

## 3. Pay-As-You-Go — Credit Packs

No subscription required. Credits never expire. Rate matches Starter (₹25/try-on) — differentiation from plans is through features, not price.

| Pack | Credits | Price | Fast try-ons approx. |
|---|---|---|---|
| Small | 40 | ₹500 | ~20 |
| Standard | 100 | ₹1,250 | ~50 |
| Large | 250 | ₹3,125 | ~125 |

**PAYG limitations (vs subscriptions):**
- Try-ons only — no catalogue exports
- 15-day try-on history
- FabricFit watermark on all results (cannot be removed)
- 1 branch only
- No fabric/outfit library management (single-session upload)

> Subscription holders can also buy top-up packs at these same rates when they run out mid-month.

---

## 4. Add-Ons

| Add-On | Price | Eligible Plans |
|---|---|---|
| Remove FabricFit watermark | ₹499/month | Starter only |
| Extra credit top-up pack (40 credits) | ₹500 | All plans + PAYG |
| Extra credit top-up pack (100 credits) | ₹1,250 | All plans + PAYG |
| Extra credit top-up pack (250 credits) | ₹3,125 | All plans + PAYG |

---

## 5. Plan Comparison Matrix (full)

| Feature | PAYG | Starter | Pro | Business |
|---|---|---|---|---|
| **Credits** | Packs (no expiry) | 200/mo | 400/mo | 1,000/mo |
| **Fast try-ons (approx)** | Pack-based | 60–80 | 120–160 | 300–400 |
| **Effective rate/try-on** | ₹25 | ₹25 | ₹22.50 | ₹20 |
| **Monthly price** | ₹500–3,125/pack | ₹2,500 | ₹4,500 | ₹10,000 |
| **Branches** | 1 | 1 | 3 | Unlimited |
| **Branch credit allocation** | No | No | Yes | Yes |
| **Catalogue exports/month** | 0 | 10 | 50 | 100 |
| **Fabric/outfit storage** | Session only | 200 items | 500 items | Unlimited |
| **Try-on history** | 15 days | 30 days | 90 days | 1 year |
| **Watermark** | Always on | Removable (₹499/mo) | Off | Off |
| **Web dashboard** | No | No | No | Yes |
| **Analytics** | No | No | No | Yes |
| **Support** | None | Email | Priority email | Dedicated |
| **Annual discount** | No | 2 months free | 2 months free | 2 months free |

---

## 6. In-App Implementation Guide

### 6.1 Credit Balance UI

- **Where to show:** Top-right of Dashboard header as a pill chip — `● 142 credits`
- **Color states:**
  - > 30% remaining: neutral gray
  - 10–30% remaining: warning orange (`#FF9500`)
  - < 10% remaining: error red (`#FF3B30`) with pulse animation
- **Tap behavior:** Opens a Credits & Plan bottom sheet showing breakdown, top-up option, and current plan

### 6.2 Credit Deduction Flow

```
User taps "Generate Try-On"
  → Check credits_remaining >= cost (2 for fast, 3 for detailed)
  → If no: block with "Not enough credits" modal + Buy Credits CTA
  → If yes: optimistically deduct from local state
  → Call try-on API
  → On success: confirm deduction in Supabase
  → On failure: refund deducted credits, show error + retry
```

> Deduct optimistically on the client, confirm server-side on success. Never let a failed try-on silently consume credits.

### 6.3 Credit Warning States

| State | Trigger | UI |
|---|---|---|
| Low credits warning | < 20% remaining | Banner on Dashboard: "You have X credits left. Top up to keep going." |
| Critical credits warning | < 10% remaining | Red pill in header, banner persists across screens |
| Zero credits | 0 remaining | Try-on button disabled + locked icon. Modal on tap: "No credits left" + Buy / Upgrade CTA |
| Monthly reset incoming | 3 days before reset | Subtle banner: "Your credits reset in 3 days" (only if < 30% remaining) |

### 6.4 Catalogue Limit Enforcement

- Show a counter on the Catalogues screen: `8 of 10 exports used this month`
- Progress bar fills as exports are used
- When limit hit: "Export" button disabled, tooltip: "You've used all 10 catalogue exports this month. Resets on [date] or upgrade to Pro for 50."
- Export count resets on the same day as credit reset (billing date)

### 6.5 Branch Management (Pro + Business)

**Owner flow:**
1. Settings → Branches → Add Branch
2. Enter branch name, assign manager email
3. Allocate credits to branch (slider or input: "X of Y credits remaining")
4. Manager receives email invite → creates account → linked to branch
5. Manager sees only their branch's try-ons, catalogue, and storage

**Credit allocation rules:**
- Owner can reallocate unspent credits between branches anytime
- Branch cannot exceed its allocated credit ceiling
- Owner's own device uses the "Main Branch" credit allocation
- Business web dashboard: bulk allocation across all branches from one screen

### 6.6 Watermark Add-On (Starter only)

- Settings → Plan & Billing → "Remove Watermark — ₹499/month"
- Toggle in settings, charged immediately via Razorpay, applied to all future try-ons in that billing cycle
- Watermark removal does NOT retroactively apply to saved results
- Cancelling the add-on re-applies watermark from next try-on

### 6.7 Try-On History Expiry

- On result generation: store `expires_at = created_at + plan_retention_days`
- Supabase Edge Function (cron, daily at 2 AM IST): soft-delete all rows where `expires_at < now()`
- Also delete the image from Supabase Storage in the same job
- UI: expired results show a placeholder "Result expired — retake try-on" instead of empty state

### 6.8 Plan Upgrade / Downgrade

- Upgrade: immediate — credits top up to new plan limit, pro-rated charge via Razorpay
- Downgrade: effective at next billing cycle — do not cut features mid-month
- Downgrade to PAYG (cancel subscription): retain data until current period ends, then apply PAYG limits

### 6.9 Payment Integration

Use **Razorpay** (Indian payments — UPI, cards, net banking, EMI).

| Payment event | Action |
|---|---|
| New subscription | Create Razorpay subscription, store `subscription_id` in Supabase |
| Monthly renewal | Razorpay auto-charges, webhook triggers credit reset |
| Credit top-up pack | One-time Razorpay order, webhook adds credits immediately |
| Add-on purchase | One-time or recurring Razorpay order, toggle flag in `organizations` table |
| Payment failure | Retry 3x over 7 days, then suspend plan (grace period), email owner |
| Refund | Manual via Razorpay dashboard, no in-app refund flow for v1.0 |

---

## 7. Database Schema (Supabase)

### `organizations`
```
id, name, owner_id, plan (payg|starter|pro|business),
credits_remaining, credits_limit, plan_reset_date,
watermark_removed (bool), annual_billing (bool),
razorpay_subscription_id, created_at
```

### `branches`
```
id, org_id, name, manager_user_id,
credits_allocated, credits_used, created_at
```

### `credit_transactions`
```
id, org_id, branch_id,
type (debit|credit),
amount (credits),
action (tryon_fast|tryon_detailed|catalogue_page|topup|plan_reset),
reference_id (try-on ID or pack order ID),
created_at
```

### `try_on_results`
```
id, org_id, branch_id, fabric_id,
customer_photo_url, result_url,
garment_type (shirt|tshirt),
mode (fast|detailed),
credits_used,
created_at, expires_at
```

### `catalogues`
```
id, org_id, name, cover_photo_url, logo_url,
pages_count, status (draft|exported),
exported_at, created_at
```

### `catalogue_pages`
```
id, catalogue_id, fabric_id, model_photo_url,
result_url, page_order, created_at
```

### `fabric_items`
```
id, org_id, branch_id (nullable — null = shared across org),
name, type (shirt_fabric|tshirt_fabric),
image_url, colour_tags[], created_at
```

---

## 8. Key Business Rules

1. **Credits reset on billing date** — not the 1st of the month. Avoids confusion when users sign up mid-month.
2. **Unused credits do not roll over** — they expire at reset. State this clearly in the app.
3. **PAYG top-up credits never expire** — even for subscription holders buying top-ups.
4. **Catalogue API cost is absorbed** — you pay the API cost per catalogue page; user only sees export count limit.
5. **Branch credits cannot exceed allocation** — hard block at branch level, not just a warning.
6. **Downgrade is always end-of-period** — never cut features mid-billing cycle.
7. **Free trial** — 14 days, 40 credits (~20 fast try-ons), no card required. Converts to PAYG or subscription at end.
8. **Storage hard limits** — Starter (200 items) and Pro (500 items) are enforced on upload. Show current count in Settings.

---

## 9. Margin Summary

| Plan | Monthly Revenue | Credit API Cost | Catalogue API Cost (est.) | Supabase + Infra | Net Margin (est.) |
|---|---|---|---|---|---|
| Starter | ₹2,500 | ₹1,250 | ~₹250 (10 pages × 2 credits × ₹12.50) | ~₹200 | ~32% |
| Pro | ₹4,500 | ₹2,500 | ~₹750 (50 pages) | ~₹300 | ~21% |
| Business | ₹10,000 | ₹6,250 | ~₹1,500 (100 pages) | ~₹500 | ~17.5% |

> Margins improve significantly at scale when you negotiate volume pricing with the API provider or self-host the model. Target: move to self-hosted inference after 500+ active subscribers.
