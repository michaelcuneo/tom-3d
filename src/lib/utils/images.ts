export async function resizeImagePair(
	file: File,
	format: 'image/webp' | 'image/jpeg' = 'image/webp',
	quality = 0.8
): Promise<{ full: File; thumb: File }> {
	const createResized = (
		img: HTMLImageElement,
		maxWidth: number,
		maxHeight: number,
		suffix: string
	): Promise<File> =>
		new Promise((resolve, reject) => {
			let { width, height } = img;

			const scale = Math.min(maxWidth / width, maxHeight / height, 1);
			width = Math.floor(width * scale);
			height = Math.floor(height * scale);

			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext('2d');
			if (!ctx) return reject('Failed to get canvas context');

			ctx.drawImage(img, 0, 0, width, height);
			canvas.toBlob(
				(blob) => {
					if (!blob) return reject('Failed to compress image');
					const name = file.name.replace(/\.\w+$/, `${suffix}.webp`);
					resolve(new File([blob], name, { type: format }));
				},
				format,
				quality
			);
		});

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		const img = new Image();

		reader.onload = () => {
			img.src = reader.result as string;
		};

		img.onload = async () => {
			try {
				const full = await createResized(img, 1200, 800, '');
				const thumb = await createResized(img, 600, 400, '_thumb');
				resolve({ full, thumb });
			} catch (err) {
				reject(err);
			}
		};

		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
