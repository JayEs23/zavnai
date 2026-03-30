import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const MAX_PAYLOAD_KEYS = 24;
const MAX_STRING_LEN = 128;

function sanitizePayload(
  raw: unknown
): Record<string, string | number | boolean> {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }
  const out: Record<string, string | number | boolean> = {};
  const entries = Object.entries(raw as Record<string, unknown>).slice(0, MAX_PAYLOAD_KEYS);
  for (const [k, v] of entries) {
    if (!/^[a-zA-Z0-9_.]+$/.test(k) || k.length > 48) continue;
    if (typeof v === 'string') {
      out[k] = v.slice(0, MAX_STRING_LEN);
    } else if (typeof v === 'number' && Number.isFinite(v)) {
      out[k] = v;
    } else if (typeof v === 'boolean') {
      out[k] = v;
    }
  }
  return out;
}

/**
 * Authenticated product analytics sink: structured JSON log line (no PII beyond user id).
 * Wire log drains / Opik / warehouse in ops (see zavndocs 08, 16 §11).
 */
export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as {
      event?: string;
      ts?: number;
      sessionMs?: number;
      payload?: unknown;
    };

    const event = typeof body.event === 'string' ? body.event.slice(0, 96) : '';
    if (!event || !/^[a-z][a-z0-9_.]{1,94}$/i.test(event)) {
      return NextResponse.json({ error: 'Invalid event name' }, { status: 400 });
    }

    const userId = session.user.id ?? session.user.email ?? 'unknown';
    const ts = typeof body.ts === 'number' ? body.ts : Date.now();
    const sessionMs =
      typeof body.sessionMs === 'number' && Number.isFinite(body.sessionMs)
        ? body.sessionMs
        : undefined;

    const payload = sanitizePayload(body.payload);

    const line = JSON.stringify({
      type: 'product_analytics',
      event,
      userId,
      ts,
      sessionMs,
      payload,
    });

    console.info(line);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[product-analytics]', e);
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
