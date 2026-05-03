import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'bildyapp',
            use_filename: true,
            unique_filename: false,
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};

const uploadBuffer = async (buffer, filename) => {
    try {
        const result = await cloudinary.uploader.upload_stream({
            folder: 'bildyapp',
            use_filename: true,
            unique_filename: false,
        }, (error, result) => {
            if (error) {
                console.error('Error uploading buffer to Cloudinary:', error);
                throw error;
            }
            return result.secure_url;
        }
        ).end(buffer);
        return result;
    } catch (error) {
        console.error('Error uploading buffer to Cloudinary:', error);
        throw error;
    }
};

export const uploadPdf = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'bildyapp/pdfs',
            resource_type: 'raw',
            use_filename: true,
            unique_filename: false,
        });
        return result.secure_url;
    }
    catch (error) {
        console.error('Error uploading PDF to Cloudinary:', error);
        throw error;
    }
};

export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw error;
    }
};