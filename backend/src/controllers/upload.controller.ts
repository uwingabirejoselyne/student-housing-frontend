import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

// Upload single image
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    // Upload to Cloudinary from buffer
    const result = await new Promise((resolve, reject) => {
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
      uploadStream.end(req.file?.buffer);
    });

    res.status(200).json({
      status: 'success',
      data: {
        url: (result as any).secure_url,
        publicId: (result as any).public_id,
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload image'
    });
  }
};

// Upload multiple images
export const uploadImages = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No image files provided'
      });
    }

    const uploadPromises = req.files.map((file: Express.Multer.File) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'student-housing/properties',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result?.secure_url,
              publicId: result?.public_id,
            });
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      status: 'success',
      data: results
    });
  } catch (error) {
    console.error('Images upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload images'
    });
  }
};

// Delete image from Cloudinary
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        status: 'error',
        message: 'Public ID is required'
      });
    }

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      status: 'success',
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Image delete error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete image'
    });
  }
};
