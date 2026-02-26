import { v2 as cloudinary } from 'cloudinary';

class CloudinaryService {
  constructor() {
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
    }
  }

  async uploadDocument(file, folder = 'documents') {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.warn('Cloudinary not configured');
      return null;
    }

    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `ngo/${folder}`,
        resource_type: 'auto'
      });
      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error.message);
      return null;
    }
  }

  async deleteDocument(publicId) {
    if (!process.env.CLOUDINARY_CLOUD_NAME) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error.message);
    }
  }
}

export default new CloudinaryService();
