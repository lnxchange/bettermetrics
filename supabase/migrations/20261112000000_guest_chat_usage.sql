-- Server-side daily limits on guest chat questions.
--
-- The signed cookie in lib/guest-quota.ts can be bypassed by not sending it,
-- so /api/chat also counts guest questions here, per hashed IP address and
-- site-wide, per UTC day. Raw IP addresses are never stored.
-- Only the service role reads or writes this table.

CREATE TABLE public.guest_chat_usage (
  bucket text NOT NULL,
  day date NOT NULL,
  count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, day)
);

ALTER TABLE public.guest_chat_usage ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.guest_chat_usage FROM anon, authenticated;
GRANT ALL ON public.guest_chat_usage TO service_role;

-- Counts one guest question against both limits, atomically.
-- Returns allowed = false (and counts nothing) when either limit is reached.
CREATE OR REPLACE FUNCTION public.consume_guest_chat(
  p_ip_hash text,
  p_ip_limit integer,
  p_global_limit integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_day date := (now() AT TIME ZONE 'utc')::date;
  v_ip integer;
  v_all integer;
BEGIN
  -- Lock both rows in a fixed order so concurrent requests serialise.
  INSERT INTO guest_chat_usage (bucket, day, count) VALUES ('all', v_day, 0)
    ON CONFLICT (bucket, day) DO NOTHING;
  INSERT INTO guest_chat_usage (bucket, day, count) VALUES ('ip:' || p_ip_hash, v_day, 0)
    ON CONFLICT (bucket, day) DO NOTHING;

  SELECT count INTO v_all FROM guest_chat_usage
    WHERE bucket = 'all' AND day = v_day FOR UPDATE;
  SELECT count INTO v_ip FROM guest_chat_usage
    WHERE bucket = 'ip:' || p_ip_hash AND day = v_day FOR UPDATE;

  IF v_all >= p_global_limit THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'global', 'ip_count', v_ip, 'global_count', v_all);
  END IF;
  IF v_ip >= p_ip_limit THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'ip', 'ip_count', v_ip, 'global_count', v_all);
  END IF;

  UPDATE guest_chat_usage SET count = count + 1 WHERE bucket = 'all' AND day = v_day;
  UPDATE guest_chat_usage SET count = count + 1 WHERE bucket = 'ip:' || p_ip_hash AND day = v_day;

  RETURN jsonb_build_object('allowed', true, 'reason', null, 'ip_count', v_ip + 1, 'global_count', v_all + 1);
END;
$$;

REVOKE ALL ON FUNCTION public.consume_guest_chat(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_guest_chat(text, integer, integer) TO service_role;

-- Old rows are not needed once the day has passed.
CREATE INDEX guest_chat_usage_day_idx ON public.guest_chat_usage (day);
