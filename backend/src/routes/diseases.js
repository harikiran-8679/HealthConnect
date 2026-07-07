import { Router } from 'express';
import { list, getById, create, update, remove } from '../controllers/diseasesController.js';

const router = Router();

router.get('/', list);
router.get('/:id', getById);

export default router;
