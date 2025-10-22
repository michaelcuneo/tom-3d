import type { PageServerLoad, Actions } from './$types';
import { Resource } from 'sst';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({});

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
				const url = `https://${Resource.ThomasBucket.name}.s3.${region}.amazonaws.com/${proj.featuredImage}?t=${Date.now()}`;
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
		const featured = data.get('featured') === 'true';
		const imageKey = data.get('imageKey')?.toString();
		const full = data.get('file_full') as File;
		const thumb = data.get('file_thumb') as File;
		const sort = featured ? Date.now() + 1_000_000_000_000 : Date.now();

		if (!title || !description || !imageKey || !full || !thumb) {
			return { error: 'Missing required fields or files' };
		}

		// Upload to S3
		await Promise.all([
			s3.send(
				new PutObjectCommand({
					Bucket: Resource.ThomasBucket.name,
					Key: imageKey,
					Body: new Uint8Array(await full.arrayBuffer()),
					ContentType: full.type
				})
			),
			s3.send(
				new PutObjectCommand({
					Bucket: Resource.ThomasBucket.name,
					Key: imageKey.replace(/\.\w+$/, '_thumb.webp'),
					Body: new Uint8Array(await thumb.arrayBuffer()),
					ContentType: thumb.type
				})
			)
		]);

		// Continue to API creation
		const res = await fetch(Resource.ThomasProjectApi.url + '/project/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title, description, imageKey, sort })
		});

		if (!res.ok) return { error: 'Failed to create project' };
		return { success: true };
	},

	updateProject: async ({ request }) => {
		const data = await request.formData();

		const id = data.get('id')?.toString();
		const sort = Number(data.get('sort'));
		const title = data.get('title')?.toString();
		const description = data.get('description')?.toString();
		const createdAt = data.get('createdAt')?.toString();
		const oldKey = data.get('existingKey')?.toString();
		const newKey = data.get('imageKey')?.toString();
		const fileFull = data.get('file_full') as File;
		const fileThumb = data.get('file_thumb') as File;

		if (!id || !title || !description || !sort) {
			return { error: 'Missing required fields' };
		}

		let finalKey = oldKey;

		// If a new image has been uploaded, process it
		if (newKey && newKey !== oldKey && fileFull && fileThumb) {
			const s3 = new S3Client({});
			const bucket = Resource.ThomasBucket.name;

			await Promise.all([
				s3.send(
					new PutObjectCommand({
						Bucket: bucket,
						Key: newKey,
						Body: new Uint8Array(await fileFull.arrayBuffer()),
						ContentType: fileFull.type
					})
				),
				s3.send(
					new PutObjectCommand({
						Bucket: bucket,
						Key: newKey.replace(/\.\w+$/, '_thumb.webp'),
						Body: new Uint8Array(await fileThumb.arrayBuffer()),
						ContentType: fileThumb.type
					})
				)
			]);

			if (oldKey) {
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
					console.warn('Failed to delete old images:', err);
				}
			}

			finalKey = newKey;
		}

		// Now send the update request to the API
		const res = await fetch(`${Resource.ThomasProjectApi.url}/project/update`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id,
				sort,
				title,
				description,
				createdAt,
				imageKey: finalKey
			})
		});

		if (!res.ok) return { error: 'Failed to update project' };
		return { success: true };
	},

	deleteProject: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const sort = data.get('sort')?.toString();
		const key = data.get('key')?.toString();

		if (!id || !sort || !key) {
			return { error: 'Missing required fields' };
		}

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
			body: JSON.stringify({ id, sort })
		});

		if (!res.ok) return { error: 'Failed to delete project' };
		return { success: true };
	}
};
