import cloudinary from '../config/cloudinary';

export class UploadService {
  /**
   * Upload single image to Cloudinary
   */
  async uploadImage(fileBuffer: Buffer): Promise<{ url: string; publicId: string }> {
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'student-housing/properties',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(fileBuffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  /**
   * Upload multiple images to Cloudinary
   */
  async uploadImages(files: Express.Multer.File[]): Promise<Array<{ url: string; publicId: string }>> {
    const uploadPromises = files.map((file) => {
      return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'student-housing/properties',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result?.secure_url || '',
              publicId: result?.public_id || '',
            });
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    return await Promise.all(uploadPromises);
  }

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<void> {
    if (!publicId) {
      throw new Error('Public ID is required');
    }

    await cloudinary.uploader.destroy(publicId);
  }
}

export default new UploadService();
