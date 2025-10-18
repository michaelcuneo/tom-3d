import { Resource } from 'sst';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const command = new PutObjectCommand({
	Key: 'file.txt',
	Bucket: Resource.ThomasBucket.name
});
await getSignedUrl(new S3Client({}), command);
