const cloudinary = require('cloudinary').v2;
const {
  CloudinaryStorage,
} = require('multer-storage-cloudinary');
const multer = require('multer');


cloudinary.config({
  cloud_name: 'daxm65zyi',
  api_key: '137132137829925',
  api_secret: 'QaueEe7IdbkMZP8FGgTY0kSbuuo',
});


// Set up Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_photos', // Cloudinary folder
    allowed_formats: ['jpeg', 'png', 'jpg'], // Accepted file types

  },
});

const upload = multer({ storage });


module.exports = { cloudinary, upload }; // Export both `cloudinary` and `upload`

