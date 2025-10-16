import { createClient } from '@openauthjs/openauth/client';
import type { RequestEvent } from '@sveltejs/kit';
import { Resource } from 'sst';

export function createAuthClient(event: RequestEvent) {
	return createClient({
		clientID: 'booky-client',
		issuer: Resource.ThomasAuth.url,
		fetch: event.fetch
	});
};

export function setTokens(event: RequestEvent, access: string, refresh: string) {
	event.cookies.set('refresh_token', refresh, {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 34560000
	});
	event.cookies.set('access_token', access, {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 34560000
	});
};

export function clearTokens(event: RequestEvent) {
	event.cookies.delete('refresh_token', {
		httpOnly: true,
		sameSite: 'lax',
		path: '/'
	});
	event.cookies.delete('access_token', {
		httpOnly: true,
		sameSite: 'lax',
		path: '/'
	});
};
