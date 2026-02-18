-- Add overview, departure_note, and departure_dates to packages
ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS overview TEXT,
  ADD COLUMN IF NOT EXISTS departure_note TEXT,
  ADD COLUMN IF NOT EXISTS departure_dates JSONB DEFAULT '[]';

-- departure_dates format: [{"tentative_date": "Around 10 March 2026", "note": "Subject to final airline confirmation"}, ...]
-- bookings.departure_date is already the confirmed departure date for assigned customers
