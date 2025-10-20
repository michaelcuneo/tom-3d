import { Resource } from 'sst';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import type { APIGatewayProxyEvent } from 'aws-lambda';

export const getUploadUrl = async (event: APIGatewayProxyEvent) => {
	const { filename, contentType } = JSON.parse(event.body || '{}');

	const s3Client = new S3Client({ region: 'ap-southeast-2' });
	const key = `projects/${Date.now()}_${filename}`;

	const command = new PutObjectCommand({
		Bucket: Resource.ThomasBucket.name,
		Key: key,
		ContentType: contentType
	});

	const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

	return {
		statusCode: 200,
		body: JSON.stringify({ uploadUrl: url, key })
	};
};
