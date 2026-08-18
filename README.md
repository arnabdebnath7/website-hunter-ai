# Restaurant Niketa — Premium Website

Luxury single-page experience for Restaurant Niketa, Contai (Estd. 2013) — dark/light themes,
signature menu with cart + demo checkout, Google sign-in (Firebase), table reservations via
WhatsApp, and full accessibility support.

## Firebase Google Sign-In (owner setup — 3 minutes)

The login code is fully wired. To activate it for your domain:

1. Create/open your project at <https://console.firebase.google.com>
2. **Project settings → Your apps → Web app** → copy the config values.
3. Paste them into **`src/lib/firebase.ts`** (replace the `PASTE_YOUR_...` values),
   or set them as environment variables:
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
   `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
4. **Authentication → Sign-in method → Google → Enable.**
5. **Authentication → Settings → Authorized domains → Add** your deployed domain
   (e.g. `your-site.vercel.app`). `localhost` is allowed by default.

Until keys are added, the sign-in modal shows an owner setup note and guests can still
browse and use the demo checkout.

## Payments

The checkout is a **demo**: UPI/Card details are validated locally and no real money moves.
"Order via WhatsApp" remains available as the real ordering channel.

## Scripts

```bash
npm install
npm run build
```

Stack: Vite + React 19 + TypeScript + Tailwind CSS 4 + Framer Motion + Firebase Auth.
