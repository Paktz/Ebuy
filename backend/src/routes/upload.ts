import express from 'express';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/images', upload.array('images', 5), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const urls = files.map(file => `http://localhost:3001/uploads/${file.filename}`);
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading files' });
  }
});

export default router;