import { Router } from 'express';
import { list, create, remove } from '../controllers/languagesController.js';

const router = Router();

router.get('/', list);

export default router;
