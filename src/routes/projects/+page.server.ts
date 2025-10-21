import type { PageServerLoad, Actions } from './$types';
import { uploadImageWithThumb } from '$lib/utils/uploadImageWithThumb';
import { Resource } from 'sst';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const apiUrl = `${Resource.ThomasProjectApi.url}/projects/list?t=${Date.now()}`;
	const resp = await fetch(apiUrl, { headers: { 'cache-control': 'no-store' } });

	if (!resp.ok) throw new Error('Failed to fetch projects');

	const rawProjects: { featuredImage?: string; title: string; description: string }[] =
		await resp.json();

	const projects = await Promise.all(
		rawProjects.map(async (proj) => {
			if (proj.featuredImage) {
				const region = process.env.AWS_REGION ?? 'us-east-1'; // fallback if not set
				const url = `https://${Resource.ThomasBucket.name}.s3.${region}.amazonaws.com/${proj.featuredImage}`;
				return { ...proj, featuredImageUrl: url };
			}
			return { ...proj, featuredImageUrl: undefined };
		})
	);

	const isLoggedIn = !!locals.session;

	return {
		projects,
		isLoggedIn
	};
};

export const actions: Actions = {
	createProject: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title')?.toString();
		const description = data.get('description')?.toString();
		const file = data.get('file') as File;

		if (!title || !description || !file || typeof file === 'string') {
			return { error: 'Missing required fields or file' };
		}

		const key = await uploadImageWithThumb(file);

		const res = await fetch(Resource.ThomasProjectApi.url + '/project/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title, description, imageKey: key })
		});

		if (!res.ok) return { error: 'Failed to create project' };
		return { success: true };
	},

	updateProject: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const title = data.get('title')?.toString();
		const description = data.get('description')?.toString();
		const oldKey = data.get('existingKey')?.toString();
		const file = data.get('file') as File; // this matches your form name

		if (!id || !title || !description) return { error: 'Missing required fields' };

		const s3 = new S3Client({});
		const bucket = Resource.ThomasBucket.name;
		let key = oldKey; // default to existing image

		// if a new file was uploaded, process and upload it
		if (file && typeof file !== 'string' && file.size > 0) {
			const newKey = await uploadImageWithThumb(file);

			// delete the old full + thumb if a previous image existed
			if (oldKey && oldKey !== newKey) {
				try {
					await Promise.all([
						s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: oldKey })),
						s3.send(
							new DeleteObjectCommand({
								Bucket: bucket,
								Key: oldKey.replace(/\.\w+$/, '_thumb.webp')
							})
						)
					]);
				} catch (err) {
					console.warn('Warning: failed to delete old image(s):', err);
				}
			}

			key = newKey; // replace with the new uploaded image key
		}

		// update project record through your API
		const res = await fetch(`${Resource.ThomasProjectApi.url}/project/update`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, title, description, imageKey: key })
		});

		const resText = await res.text();
		console.log('Update API response:', res.status, resText);

		if (!res.ok) return { error: 'Failed to update project' };

		return { success: true };
	},

	deleteProject: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const key = data.get('key')?.toString();

		if (!id || !key) return { error: 'Missing project ID or key' };

		const s3 = new S3Client();
		const bucket = Resource.ThomasBucket.name;

		await Promise.all([
			s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key })),
			s3.send(
				new DeleteObjectCommand({
					Bucket: bucket,
					Key: key.replace(/\.\w+$/, '_thumb.webp')
				})
			)
		]);

		const res = await fetch(Resource.ThomasProjectApi.url + '/project/delete', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(id)
		});

		if (!res.ok) return { error: 'Failed to delete project' };
		return { success: true };
	}
};
