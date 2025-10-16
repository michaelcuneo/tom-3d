// src/routes/auth/refresh/+server.ts
import { json } from '@sveltejs/kit';
import { createAuthClient, setTokens, clearTokens } from '$lib/auth.server.js';
import { subjects } from '../../../../../auth/subjects';

const SKEW_SECONDS = 60; // refresh if exp is within 60s

function decodeJwtPayload<T = any>(jwt: string | null): T | null {
  if (!jwt) return null;
  const parts = jwt.split('.');
  if (parts.length < 2) return null;
  const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  try {
    return JSON.parse(Buffer.from(b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '='), 'base64').toString('utf8')) as T;
  } catch {
    return null;
  }
}

export async function POST(event) {
  const access = event.cookies.get('access_token') ?? null;
  const refresh = event.cookies.get('refresh_token') ?? undefined;

  // No tokens at all -> unauthenticated
  if (!access && !refresh) {
    return json({ error: 'not_authenticated' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  // If we have an access token and it’s not expiring, just return it
  const claims: any = decodeJwtPayload(access);
  const now = Math.floor(Date.now() / 1000);
  const exp = Number(claims?.exp ?? 0);
  const nearExpiry = !exp || exp - now < SKEW_SECONDS;

  // If no refresh token available and access is near/after expiry -> clear & 401
  if (!refresh && nearExpiry) {
    clearTokens(event);
    return json({ error: 'expired' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  let currentAccess = access;
  try {
    // Use your auth client’s verify which can also refresh when given { refresh }
    const client = createAuthClient(event);
    const verified = await client.verify(subjects, access ?? '', { refresh });

    if (verified.err) {
      // refresh/verify failed -> clear session
      clearTokens(event);
      return json({ error: 'refresh_failed' }, { status: 401, headers: { 'cache-control': 'no-store' } });
    }

    // If new tokens were issued, rotate cookies & use the fresh access token
    if (verified.tokens) {
      setTokens(event, verified.tokens.access, verified.tokens.refresh);
      currentAccess = verified.tokens.access;
    }

    // If nothing was issued but we still have a valid access token, return it
    if (!currentAccess) {
      // Safety: if we end up here without any usable token, treat as unauthenticated
      clearTokens(event);
      return json({ error: 'no_token' }, { status: 401, headers: { 'cache-control': 'no-store' } });
    }

    // Recompute exp from the (possibly) new token
    const updatedClaims: any = decodeJwtPayload(currentAccess);
    const updatedExp = Number(updatedClaims?.exp ?? 0);

    return json(
      {
        access_token: currentAccess,
        expires_at: updatedExp || null // epoch seconds if present
      },
      { headers: { 'cache-control': 'no-store' } }
    );
  } catch (e) {
    console.error('refresh error:', e);
    // Conservative: don’t drop cookies unless clearly invalid; but respond 500
    return json({ error: 'server_error' }, { status: 500, headers: { 'cache-control': 'no-store' } });
  }
}

// Optional: disallow GET to avoid accidental caching proxies
export function GET() {
  return json({ error: 'method_not_allowed' }, { status: 405, headers: { 'cache-control': 'no-store' } });
}
