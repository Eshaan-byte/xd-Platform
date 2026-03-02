import { createModuleLogger } from '../config/logger.js';
import { generateUploadUrl, getPublicUrl, sanitizeFileName } from '../config/s3.js';
import { GenerateUploadUrlInput, UploadUrlResponseDto } from '../dto/upload.dto.js';

const logger = createModuleLogger('UploadService');

export class UploadService {
  async generateUploadUrl(
    input: GenerateUploadUrlInput
  ): Promise<UploadUrlResponseDto> {
    try {
      logger.info(
        { fileName: input.fileName, uploadType: input.uploadType },
        'Generating upload URL'
      );

      const sanitized = sanitizeFileName(input.fileName);
      const timestamp = Date.now();
      const folder = input.uploadType === 'game' ? 'games' : 'thumbnails';
      const key = `${folder}/${timestamp}_${sanitized}`;

      const uploadUrl = await generateUploadUrl(key, input.fileType, 3600);

      const publicUrl = getPublicUrl(key);

      logger.info({ key }, 'Upload URL generated successfully');

      return {
        uploadUrl,
        key,
        publicUrl,
        expiresIn: 3600,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to generate upload URL');
      throw error;
    }
  }
}
