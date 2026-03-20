import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

let inflight: Promise<Session | null> | null = null;

/**
 * Deduplicate concurrent getSession() calls to a single in-flight request.
 * NextAuth's getSession() hits /api/auth/session every time; parallel API
 * calls (dashboard + navbar, Promise.all, etc.) can overload the route and
 * surface "Failed to fetch" / CLIENT_FETCH_ERROR in dev.
 */
export async function getSessionDeduped(): Promise<Session | null> {
  if (inflight) return inflight;
  inflight = getSession().finally(() => {
    inflight = null;
  });
  return inflight;
}
