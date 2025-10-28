import type { PageServerLoad, Actions } from './$types';
import { Resource } from 'sst';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({});

function isVideoUrl(url: string) {
	return /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
}

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const apiUrl = `${Resource.ThomasProjectApi.url}/projects/list?t=${Date.now()}`;
	const resp = await fetch(apiUrl, { headers: { 'cache-control': 'no-store' } });

	if (!resp.ok) throw new Error('Failed to fetch projects');

	const projects: { featuredImage?: string; title: string; description: string }[] =
		await resp.json();

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
		const mediaUrl = data.get('mediaUrl')?.toString();
		const full = data.get('file_full') as File | null;

		if (!title || !description || !mediaUrl) {
			return { error: 'Missing required fields or files' };
		}

		// Determine sort order (or use your own logic)
		const sort = Date.now();

		// 🧠 Check if it's a video or image
		let finalMediaUrl = mediaUrl;

		if (!isVideoUrl(mediaUrl) && full) {
			// Upload to S3 if it's NOT a video
			await s3.send(
				new PutObjectCommand({
					Bucket: Resource.ThomasBucket.name,
					Key: mediaUrl, // S3 key, not a full URL
					Body: new Uint8Array(await full.arrayBuffer()),
					ContentType: full.type
				})
			);

			// You can convert to full URL if your API expects that
			finalMediaUrl = `https://${Resource.ThomasBucket.name}.s3.amazonaws.com/${mediaUrl}`;
		}

		// ✅ Send to API (S3 URL or video link)
		const res = await fetch(`${Resource.ThomasProjectApi.url}/project/create`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				title,
				description,
				sort,
				mediaUrl: finalMediaUrl
			})
		});

		if (!res.ok) {
			console.error(await res.text());
			return { error: 'Failed to create project' };
		}

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
