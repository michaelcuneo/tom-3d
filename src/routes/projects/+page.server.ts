import type { PageServerLoad, Actions } from './$types';
import { Resource } from 'sst';
import {
	S3Client,
	GetObjectCommand,
	PutObjectCommand,
	DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const apiUrl = `${Resource.ThomasProjectApi.url}/projects/list?t=${Date.now()}`;
	const resp = await fetch(apiUrl, { headers: { 'cache-control': 'no-store' } });

	if (!resp.ok) throw new Error('Failed to fetch projects');

	const rawProjects: { featuredImage?: string; title: string; description: string }[] =
		await resp.json();

	const s3 = new S3Client({});

	const projects = await Promise.all(
		rawProjects.map(async (proj) => {
			if (proj.featuredImage) {
				const cmd = new GetObjectCommand({
					Bucket: Resource.ThomasBucket.name,
					Key: proj.featuredImage
				});
				const url = await getSignedUrl(s3, cmd, { expiresIn: 306033 }); // 1 hour
				return { ...proj, featuredImageUrl: url };
			}
			return { ...proj, featuredImageUrl: undefined };
		})
	);

	const isLoggedIn = !!locals.session;
	// const isLoggedIn = true;

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

		console.log('createProject action data:', { title, description, file });

		if (!title || !description || !file || typeof file === 'string') {
			return { error: 'Missing required fields or file' };
		}

		const extension = file.name.split('.').pop();
		const key = `${randomUUID()}.${extension}`;

		const s3 = new S3Client({});
		const upload = await s3.send(
			new PutObjectCommand({
				Bucket: Resource.ThomasBucket.name,
				Key: key,
				Body: Buffer.from(await file.arrayBuffer()),
				ContentType: file.type
			})
		);

		console.log('Uploaded file to S3 with key:', key, upload);

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
		const file = data.get('imageFile') as File;

		if (!id || !title || !description) return { error: 'Missing required fields' };

		let key = oldKey;
		if (file && typeof file !== 'string') {
			const extension = file.name.split('.').pop();
			key = `${randomUUID()}.${extension}`;

			const s3 = new S3Client({});
			await s3.send(
				new PutObjectCommand({
					Bucket: Resource.ThomasBucket.name,
					Key: key,
					Body: Buffer.from(await file.arrayBuffer()),
					ContentType: file.type
				})
			);

			if (oldKey && oldKey !== key) {
				await s3.send(
					new DeleteObjectCommand({
						Bucket: Resource.ThomasBucket.name,
						Key: oldKey
					})
				);
			}
		}

		const res = await fetch(Resource.ThomasProjectApi.url + '/project/edit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, title, description, imageKey: key })
		});

		if (!res.ok) return { error: 'Failed to update project' };
		return { success: true };
	},

	deleteProject: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const key = data.get('key')?.toString();

		if (!id || !key) return { error: 'Missing project ID or key' };

		const s3 = new S3Client({});
		await s3.send(
			new DeleteObjectCommand({
				Bucket: Resource.ThomasBucket.name,
				Key: key
			})
		);

		const res = await fetch(Resource.ThomasProjectApi.url + '/project/delete', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(id)
		});

		if (!res.ok) return { error: 'Failed to delete project' };
		return { success: true };
	}
};
