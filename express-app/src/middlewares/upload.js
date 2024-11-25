import multer from 'multer';
import { customError } from './error-handler.js';

const upload = multer({
    dest: 'uploads/',
    limits: {fileSize: process.env.FILE_SIZE_LIMIT * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('video/')
        ) {
            cb(null, true);
        } else {
            const error = customError('File type not supported', 400);
            cb(error, false);
        }
      },
    },
  );


export default upload;