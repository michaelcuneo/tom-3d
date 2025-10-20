import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	console.log('Auth layout server load called', locals);
	// Check if the session exists in locals
	if (locals.session) {
		// If not authenticated, redirect to the login page
		redirect(302, '/');
	}
}) satisfies LayoutServerLoad;
