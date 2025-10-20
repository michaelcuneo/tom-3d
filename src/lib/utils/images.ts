export async function resizeImage(
	file: File,
	maxWidth = 1200,
	maxHeight = 800,
	format: 'image/webp' | 'image/jpeg' = 'image/webp',
	quality = 0.8
): Promise<File> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const reader = new FileReader();

		reader.onload = (e) => {
			img.src = e.target?.result as string;
		};

		img.onload = () => {
			const canvas = document.createElement('canvas');
			let { width, height } = img;

			if (width > maxWidth || height > maxHeight) {
				const scale = Math.min(maxWidth / width, maxHeight / height);
				width = Math.floor(width * scale);
				height = Math.floor(height * scale);
			}

			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext('2d');
			if (!ctx) return reject('Failed to get canvas context');

			ctx.drawImage(img, 0, 0, width, height);
			canvas.toBlob(
				(blob) => {
					if (!blob) return reject('Failed to compress image');
					const optimized = new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
						type: format
					});
					resolve(optimized);
				},
				format,
				quality
			);
		};

		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
