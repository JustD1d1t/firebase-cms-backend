import express from 'express';
import multer from 'multer';
const upload = multer();

import {
  addGallery,
  addImage,
  addImages,
  getGalleries,
  getImages,
  queryGallery,
  removeFile,
  removeFiles,
  updateGallery
} from '../controllers/galleryController.js';

const router = express.Router();

router.get('/get', getGalleries);
router.get('/getImages', getImages);
router.get('/query', queryGallery);
router.put('/update/:id', updateGallery);
router.post('/new', addGallery)
router.post('/add-image', upload.single('image'), addImage);
router.post('/add-images', upload.array('images'), addImages);
router.delete('/remove-files', removeFiles);
router.delete('/remove-file', removeFile)

export default router;