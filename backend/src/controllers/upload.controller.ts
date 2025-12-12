import { Request, Response } from 'express';
import uploadService from '../services/upload.service';

/**
 * Upload single image
 */
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    const result = await uploadService.uploadImage(req.file.buffer);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload image'
    });
  }
};

/**
 * Upload multiple images
 */
export const uploadImages = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No image files provided'
      });
    }

    const results = await uploadService.uploadImages(req.files);

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

/**
 * Delete image from Cloudinary
 */
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.body;

    await uploadService.deleteImage(publicId);

    res.status(200).json({
      status: 'success',
      message: 'Image deleted successfully'
    });
  } catch (error: any) {
    console.error('Image delete error:', error);
    const statusCode = error.message.includes('required') ? 400 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to delete image'
    });
  }
};
