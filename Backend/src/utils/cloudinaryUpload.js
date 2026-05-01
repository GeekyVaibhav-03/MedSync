const cloudinary = require('cloudinary').v2;

// Some .env files may contain CLOUDINARY_URL prefixed with "CLOUDINARY_URL=".
const rawCloudinaryUrl = process.env.CLOUDINARY_URL || '';
const normalizedCloudinaryUrl = rawCloudinaryUrl.startsWith('CLOUDINARY_URL=')
  ? rawCloudinaryUrl.replace('CLOUDINARY_URL=', '')
  : rawCloudinaryUrl;

if (normalizedCloudinaryUrl) {
  cloudinary.config({
    cloudinary_url: normalizedCloudinaryUrl,
    secure: true
  });
}

const uploadBufferToCloudinary = async (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

module.exports = {
  uploadBufferToCloudinary
};
