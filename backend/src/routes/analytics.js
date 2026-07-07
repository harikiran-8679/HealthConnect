import { Router } from 'express';
import { trackPageView, getAnalytics } from '../controllers/analyticsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/track', trackPageView);
router.get('/dashboard', authenticate, requireAdmin, getAnalytics);

export default router;
