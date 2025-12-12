import express from 'express';
import { uploadImage, uploadImages, deleteImage } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// All upload routes require authentication
router.use(authenticate);

// Upload single image
router.post('/image', upload.single('image'), uploadImage);

// Upload multiple images (max 10)
router.post('/images', upload.array('images', 10), uploadImages);

// Delete image
router.delete('/image', deleteImage);

export default router;
