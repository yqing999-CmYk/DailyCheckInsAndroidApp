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
