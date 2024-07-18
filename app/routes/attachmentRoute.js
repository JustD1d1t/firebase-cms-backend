import express from 'express';
import multer from 'multer';
const upload = multer();

import {
  addAttachment,
  addAttachments,
  getAttachments,
  removeAttachment
} from '../controllers/attachmentController.js';

const router = express.Router();

router.post('/add', upload.single('attachment'), addAttachment);
router.post('/add-attachments', upload.array('attachments'), addAttachments);
router.delete('/remove', removeAttachment);
router.get('/get', getAttachments);

export default router;