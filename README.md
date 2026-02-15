# DailyCheckIns
Android app to let the user daily check-ins. If not yet checked in, before midnight, it will send out alert email.
Supabase, react, expo

**Frontend**: React Native + Expo SDK 54 (file-based routing via expo-router)
**Backend/DB**: Supabase (PostgreSQL + Auth + Edge Functions)
**Email**: Resend API
**Scheduling**: pg_cron + pg_net (Supabase built-in)
**Timezone**: US Eastern (cron at 04:55 UTC = 11:55 PM EST)

## Key Decisions
**expo-router** file-based routing (Expo SDK 54 default)
**`check_in_date` DATE column** in Eastern Time for one-per-day constraint
**AsyncStorage** for auth session persistence
**pg_cron + pg_net** for scheduling (zero extra services)
**04:55 UTC cron** = 11:55 PM EST

## How It Works

### User Flow

1. **First time**: User opens the app and creates an account (email + password)
2. **Sign in**: User signs in with email/password or phone OTP
3. **Check in**: On the home screen, user taps the large circular "Check In" button. The check-in time is recorded in the database. The button is disabled for the rest of the day (Eastern Time).
4. **Add contacts**: User navigates to the Contacts tab and adds up to 5 emergency contact email addresses.
5. **Missed check-in**: If the user does NOT check in within 24 hours, the system automatically sends alert emails to all their contacts at 11:55 PM EST.

   
### System Architecture

```
┌─────────────────────┐         ┌─────────────────────────────┐
│  Android App        │         │  Supabase Cloud             │
│  (React Native +    │  REST   │                             │
│   Expo)             │◄───────►│  Auth (email/password, OTP) │
│                     │   API   │  PostgreSQL Database         │
│  - Sign in/up       │         │    - profiles table          │
│  - Check-in button  │         │    - check_ins table         │
│  - Manage contacts  │         │    - contacts table          │
└─────────────────────┘         │                             │
                                │  pg_cron (11:55 PM EST)     │
                                │    ↓ triggers                │
                                │  Edge Function              │
                                │    ↓ calls                   │
                                │  Resend API → alert emails  │
                                └─────────────────────────────┘
```

---

## Prerequisites

- Node.js 18+
- npm (comes with Node.js)
- A Supabase project (free tier works)
- A Resend account (free tier: 100 emails/day)
- Android device with Expo Go app (for development testing)

---
---

## Environment Variables Reference

| Variable | Where to find it | Purpose |
|----------|-------------------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API | Project REST API URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API > anon public | Client-side API key |
| `RESEND_API_KEY` (Edge Function secret) | Resend Dashboard > API Keys | For sending alert emails |
| `SUPABASE_SERVICE_ROLE_KEY` (Edge Function secret) | Supabase Dashboard > Settings > API > service_role | Server-side key for cron job |

---

