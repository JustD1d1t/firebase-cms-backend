import express from 'express';

import {
  addRelease,
  deleteRelease,
  getRelease,
  getReleases,
  updateRelease,
} from '../controllers/releaseController.js';

const router = express.Router();

router.post('/new', addRelease);
router.delete('/delete/:id', deleteRelease);
router.get('/get-all', getReleases);
router.put('/update/:id', updateRelease);
router.get('/:id', getRelease);

export default router;