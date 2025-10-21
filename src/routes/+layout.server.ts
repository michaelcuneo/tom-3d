import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// Check if the session exists in locals
	const isLoggedIn = !!locals.session;

	return { isLoggedIn };
}) satisfies LayoutServerLoad;
