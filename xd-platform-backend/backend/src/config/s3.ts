import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from './env.js';
import { createModuleLogger } from './logger.js';

const logger = createModuleLogger('S3');

// Check if S3 is configured (skip placeholder values)
const isS3Configured = (): boolean => {
  const hasCredentials = !!(
    env.AWS_ACCESS_KEY_ID &&
    env.AWS_SECRET_ACCESS_KEY &&
    env.S3_BUCKET_NAME
  );

  // Skip if using placeholder values
  const isPlaceholder =
    env.AWS_ACCESS_KEY_ID?.includes('your-') ||
    env.AWS_SECRET_ACCESS_KEY?.includes('your-') ||
    env.S3_BUCKET_NAME?.includes('your-');

  return hasCredentials && !isPlaceholder;
};

let s3ClientInstance: S3Client | null = null;

export const getS3Client = (): S3Client => {
  if (!isS3Configured()) {
    throw new Error('S3 is not configured. Please set AWS credentials in .env file.');
  }

  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  return s3ClientInstance;
};

export const initializeS3 = async (): Promise<void> => {
  if (!isS3Configured()) {
    logger.warn('S3 credentials not configured - file upload features will be disabled');
    return;
  }

  try {
    const client = getS3Client();
    await client.send(
      new HeadBucketCommand({
        Bucket: env.S3_BUCKET_NAME!,
      })
    );

    logger.info(
      { bucket: env.S3_BUCKET_NAME, region: env.AWS_REGION },
      'S3 bucket connection verified'
    );
  } catch (error) {
    logger.error(
      { error, bucket: env.S3_BUCKET_NAME },
      'Failed to connect to S3 bucket'
    );
    throw error;
  }
};

export const generateUploadUrl = async (
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> => {
  if (!isS3Configured()) {
    throw new Error('S3 is not configured. Please set AWS credentials in .env file.');
  }

  try {
    const client = getS3Client();
    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn });

    logger.debug({ key }, 'Generated pre-signed upload URL');

    return signedUrl;
  } catch (error) {
    logger.error({ error, key }, 'Failed to generate upload URL');
    throw error;
  }
};

export const deleteFile = async (key: string): Promise<void> => {
  if (!isS3Configured()) {
    throw new Error('S3 is not configured. Please set AWS credentials in .env file.');
  }

  try {
    const client = getS3Client();
    await client.send(
      new DeleteObjectCommand({
        Bucket: env.S3_BUCKET_NAME!,
        Key: key,
      })
    );

    logger.info({ key }, 'File deleted from S3');
  } catch (error) {
    logger.error({ error, key }, 'Failed to delete file from S3');
    throw error;
  }
};

export const getPublicUrl = (key: string): string => {
  if (!isS3Configured()) {
    throw new Error('S3 is not configured. Please set AWS credentials in .env file.');
  }
  return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_');
};
