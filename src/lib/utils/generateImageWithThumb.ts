import { v4 as uuidv4 } from 'uuid';

export async function generateImageWithThumb(
	original: File,
	format: 'image/webp' | 'image/jpeg' = 'image/webp',
	quality = 0.8
): Promise<{ fullKey: string; fullBlob: Blob; thumbKey: string; thumbBlob: Blob }> {
	const readImage = (file: File): Promise<HTMLImageElement> =>
		new Promise((resolve, reject) => {
			const img = new Image();
			const reader = new FileReader();

			reader.onload = () => {
				img.src = reader.result as string;
			};
			img.onload = () => resolve(img);
			img.onerror = reject;
			reader.onerror = reject;

			reader.readAsDataURL(file);
		});

	const resize = async (
		img: HTMLImageElement,
		maxWidth: number,
		maxHeight: number
	): Promise<Blob> => {
		const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
		const width = Math.floor(img.width * scale);
		const height = Math.floor(img.height * scale);

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext('2d')!;
		ctx.drawImage(img, 0, 0, width, height);

		return await new Promise((resolve, reject) =>
			canvas.toBlob(
				(b) => (b ? resolve(b) : reject('Failed to convert canvas to blob')),
				format,
				quality
			)
		);
	};

	const img = await readImage(original);
	const fullBlob = await resize(img, 1200, 800);
	const thumbBlob = await resize(img, 600, 400);

	const baseKey = uuidv4();
	const ext = format === 'image/webp' ? 'webp' : 'jpg';
	const fullKey = `${baseKey}.${ext}`;
	const thumbKey = `${baseKey}_thumb.${ext}`;

	return { fullKey, fullBlob, thumbKey, thumbBlob };
}
