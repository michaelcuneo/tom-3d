import { redirect } from '@sveltejs/kit';
import { clearTokens } from '$lib/auth.server.js';

export async function GET(event) {
	clearTokens(event);

	return redirect(302, `/`);
}
