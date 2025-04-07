const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

cloudinary.uploader.upload('./burj_khalifa.jpg', { folder: 'Travessance_DEV' })
  .then(result => console.log("✅ Upload success:", result.secure_url))
  .catch(err => console.error("❌ Upload error:", err));
