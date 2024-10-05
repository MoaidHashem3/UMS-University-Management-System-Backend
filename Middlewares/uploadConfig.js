const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid')
require('dotenv').config(); 

const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        let uploadPath = 'uploads/';

        if (req.path.includes('/uploadUserImage') || req.path.includes('/register')) {
            uploadPath = 'uploads/user_images/';
        } else if (req.path.includes('/uploadCourseImage')) {
            uploadPath = 'uploads/course_images/';
        } else if (req.path.includes('/uploadCourseContent')) {
            uploadPath = 'uploads/course_pdfs/';
        }

        ensureDirectoryExistence(path.join(uploadPath, file.originalname));
        cb(null, uploadPath);
    },
    filename: function(req, file, cb){
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})
  

const upload = multer({ storage });

module.exports = upload;
