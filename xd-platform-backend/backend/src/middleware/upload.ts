import multer from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedGameTypes = [
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/x-msdownload',
  ];

  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (file.fieldname === 'game') {
    if (allowedGameTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid game file type. Only ZIP, RAR, and EXE files are allowed'
        )
      );
    }
  } else if (file.fieldname === 'thumbnail') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error('Invalid image file type. Only JPG, PNG, and WEBP are allowed')
      );
    }
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024,
  },
});
