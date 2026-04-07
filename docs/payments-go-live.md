# Payments — Going Live

crucx.ai uses Razorpay Checkout (client-side only) so the static export hosting model stays cost-free. Toggling test → live is three steps.

## 1. Create a live key in the Razorpay dashboard
Razorpay → Settings → API Keys → Generate Live Key.
You will receive a live `key_id` (starts with `rzp_live_...`) and a `key_secret` (do not put the secret in this repo).

## 2. Add the live key to your hosting env
Set both env vars on your static host (Vercel/Netlify/Apache):

```
NEXT_PUBLIC_RAZORPAY_LIVE=true
NEXT_PUBLIC_RAZORPAY_KEY_ID_LIVE=rzp_live_xxxxxxxxxxxx
```

`NEXT_PUBLIC_RAZORPAY_KEY_ID` (test key) can stay in place — it is ignored when `LIVE=true`.

## 3. Re-export and re-deploy
```
npm run build
```
Verify by opening `/checkout/` and confirming the Razorpay modal shows the live merchant name.

## Notes
- `src/lib/payments.ts` is the only file that reads these env vars. Search for `getKeyId` if you need to audit.
- Because there is no server, payment verification is best-effort client-side. For production you should add a Supabase Edge Function (free tier) that verifies the Razorpay signature and writes the `order` row server-side. The current flow writes the `order` from the client after `handler` fires; it works for low-fraud digital goods but is not signature-verified.
- Stripe is wired as a fallback shape — re-implement `openCheckout` against Stripe Checkout (also client-redirect-only) when you want to support cards in the US.
