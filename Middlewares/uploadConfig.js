const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary storage for images and PDFs
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Set default folder for images
    let folder = 'course_images';
    let resource_type = 'image'; // Default to image uploads
    let format = undefined; // Format will be optional for images

    // Check if the file is a PDF
    if (file.mimetype === 'application/pdf') {
      folder = 'course_pdfs'; // Change folder for PDFs
      resource_type = 'raw';  // Cloudinary treats PDFs as raw files
      format = 'pdf'; // Explicitly set format for PDFs
    }

    return {
      folder: folder,
      resource_type: resource_type,
      format: format, // Optional for images but set for PDFs
      public_id: file.originalname.split('.')[0], // Use the original name without the extension
    };
  },
});

// Multer config
const upload = multer({ storage });

module.exports = upload;