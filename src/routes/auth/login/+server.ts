import { redirect } from '@sveltejs/kit';
import { createAuthClient, setTokens } from '$lib/auth.server.js';
import { subjects } from '../../../../auth/subjects.js';

export async function GET(event) {
	const client = createAuthClient(event);
	try {
		const accessToken = event.cookies.get('access_token');
		if (accessToken) {
			const refreshToken = event.cookies.get('refresh_token');
			const verified = await client.verify(subjects, accessToken, {
				refresh: refreshToken
			});
			if (!verified.err) {
				if (verified.tokens) setTokens(event, verified.tokens.access, verified.tokens.refresh);
				event.locals.session = verified.subject.properties;
			}
		}
	} catch (e) {
		console.error('Error verifying token:', e);
	}

	const { url } = await client.authorize(event.url.origin + '/auth/callback', 'code');
	return redirect(302, url);
}
