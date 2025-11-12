import multer from 'multer';
import { uploadProfilePicture, deleteFromCloudinary, getPublicIdFromUrl } from '../utils/upload.js';

export const uploadProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = req.file.path;
    const publicId = req.file.filename;

    res.json({
      message: 'Profile picture uploaded successfully',
      fileUrl,
      publicId,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({
      message: 'File upload failed',
      error: error.message
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: 'File URL is required' });
    }

    const publicId = getPublicIdFromUrl(fileUrl);
    await deleteFromCloudinary(publicId);

    res.json({ message: 'Profile picture deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'File deletion failed',
      error: error.message
    });
  }
};

export const uploadMiddleware = (req, res, next) => {
  uploadProfilePicture(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: 'File size too large. Maximum size is 1MB'
        });
      }
      return res.status(400).json({
        message: 'File upload error',
        error: error.message
      });
    } else if (error) {
      return res.status(400).json({
        message: error.message
      });
    }
    next();
  });
};