import { api } from './api';

export interface UploadedImage {
  url: string;
  publicId: string;
}

export const uploadService = {
  // Upload single image
  uploadImage: async (file: File): Promise<UploadedImage> => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data;
  },

  // Upload multiple images
  uploadImages: async (files: File[]): Promise<UploadedImage[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const { data } = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data;
  },

  // Delete image
  deleteImage: async (publicId: string): Promise<void> => {
    await api.delete('/upload/image', {
      data: { publicId },
    });
  },
};
