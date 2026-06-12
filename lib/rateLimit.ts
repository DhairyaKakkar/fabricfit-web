// Lightweight in-memory sliding-window rate limiter for public API routes.
// Note: state is per server instance — on serverless this resets between cold
// starts and isn't shared across instances. It still stops the common abuse
// case (one client hammering a form endpoint / draining the email quota).
// For a hard guarantee, move to a shared store (e.g. Upstash) later.

const hits = new Map<string, number[]>();

const MAX_KEYS = 5_000; // memory cap

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= limit) {
    hits.set(key, timestamps);
    return false; // rate limited
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > MAX_KEYS) {
    for (const [k, ts] of hits) {
      if (ts.every((t) => t <= windowStart)) hits.delete(k);
      if (hits.size <= MAX_KEYS) break;
    }
  }

  return true;
}

export function clientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}
