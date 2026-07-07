import { Router } from 'express';
import upload from '../utils/upload.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/image', authenticate, requireAdmin, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, data: { imageUrl, filename: req.file.filename } });
  });
});

export default router;
