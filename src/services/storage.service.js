import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/index.js';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const uploadBuffer = (buffer, folder, resourceType = 'image') =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });

export const uploadSignatureImage = async (buffer) => {
  const result = await uploadBuffer(buffer, 'bildyapp/signatures', 'image');
  return { url: result.secure_url, publicId: result.public_id };
};

export const uploadDeliveryNotePdf = async (buffer) => {
  const result = await uploadBuffer(buffer, 'bildyapp/pdfs', 'raw');
  return { url: result.secure_url, publicId: result.public_id };
};

export const uploadLogoBuffer = async (buffer) => {
  const result = await uploadBuffer(buffer, 'bildyapp/logos', 'image');
  return { url: result.secure_url, publicId: result.public_id };
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Error borrando de Cloudinary:', error.message);
  }
};