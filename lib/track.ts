'use client';

import { track as vercelTrack } from '@vercel/analytics';

// Central CTA / event tracking. Every conversion-relevant click goes through
// here so demo→download and section→signup funnels can be measured in the
// Vercel Analytics dashboard (Events tab).
export function track(
  event: string,
  data?: Record<string, string | number | boolean>,
) {
  try {
    vercelTrack(event, data);
  } catch {
    // analytics must never break the UI
  }
}
