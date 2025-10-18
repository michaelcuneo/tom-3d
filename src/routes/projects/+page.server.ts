import type { PageServerLoad, Actions } from './$types';
import { Resource } from 'sst';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const apiUrl = Resource.ThomasProjectApi.url + '/projects/list';
	const projectsResponse = await fetch(apiUrl);

	if (!projectsResponse.ok) {
		throw new Error('Failed to fetch projects');
	}

	const projects = await projectsResponse.json();

	// Adjust if your auth system differs
	const isLoggedIn = !!locals.session;

	return {
		projects,
		isLoggedIn
	};
};

export const actions: Actions = {
	createProject: async ({ request }) => {
		const data = await request.formData();

		const title = data.get('title');
		const description = data.get('description');
		const imageKey = data.get('imageKey');

		if (!title || !description) return { error: 'Project details required' };

		const res = await fetch(Resource.ThomasProjectApi.url + '/project/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				title,
				description,
				imageKey
			})
		});

		if (!res.ok) return { error: 'Failed to create project' };
		return { success: true };
	},

	updateProject: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const title = data.get('title');
		const description = data.get('description');
		const imageKey = data.get('imageKey');

		if (!id || !title) return { error: 'Missing required fields' };

		const res = await fetch(Resource.ThomasProjectApi.url + '/project/edit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, title, description, imageKey })
		});

		if (!res.ok) return { error: 'Failed to update project' };
		return { success: true };
	},

	deleteProject: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		if (!id) return { error: 'Missing project ID' };

		const res = await fetch(Resource.ThomasProjectApi.url + '/project/delete', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(id)
		});

		if (!res.ok) return { error: 'Failed to delete project' };
		return { success: true };
	}
};
