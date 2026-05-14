/**
 * Cloudinary Configuration and Utilities
 * 
 * Update these with your actual Cloudinary account credentials
 * Sign up for free at: https://cloudinary.com/console
 */

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default",
};

/**
 * Generate optimized Cloudinary image URL
 * @param publicId - The public ID of the image in Cloudinary
 * @param options - Transformation options
 */
export const getCloudinaryImageUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  }
) => {
  const {
    width = 800,
    height = 500,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options || {};

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/${publicId}`;
};

/**
 * Generate optimized Cloudinary video URL
 * @param publicId - The public ID of the video in Cloudinary
 * @param options - Transformation options
 */
export const getCloudinaryVideoUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  }
) => {
  const {
    width = 1280,
    height = 720,
    crop = "fill",
    quality = "auto",
  } = options || {};

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/upload/w_${width},h_${height},c_${crop},q_${quality}/${publicId}`;
};

/**
 * Generate thumbnail URL from video
 */
export const getVideoThumbnailUrl = (videoPublicId: string) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/upload/w_800,h_450,c_fill,f_auto/so_0/${videoPublicId}.jpg`;
};

/**
 * Setup instructions for Cloudinary
 */
export const CLOUDINARY_SETUP = `
CLOUDINARY SETUP INSTRUCTIONS:

1. Sign up at https://cloudinary.com/console
2. Get your Cloud Name from the Dashboard
3. Create an Upload Preset (Settings > Upload)
4. Add to your .env.local file:
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

5. Replace image URLs with Cloudinary URLs:
   Original: https://images.unsplash.com/photo-...
   Cloudinary: https://res.cloudinary.com/your-cloud-name/image/upload/...

UPLOADING COURSE IMAGES:
- Use the Cloudinary console or upload via API
- Recommended: 800x500 pixels for course cards
- Format: WebP or Auto for best performance

UPLOADING DEMO VIDEOS:
- Use Cloudinary console or Upload Widget
- Recommended: MP4 format, max 100MB
- Cloudinary will automatically optimize for web

EXAMPLE URLS:
Images: https://res.cloudinary.com/your-cloud-name/image/upload/w_800,h_500,c_fill,q_auto,f_auto/course-image
Videos: https://res.cloudinary.com/your-cloud-name/video/upload/w_1280,h_720,c_fill,q_auto/course-video
`;
