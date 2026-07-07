import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getTemplates,
  addFamilyMember,
  getFamilyMembers,
  updateFamilyMember,
  deleteFamilyMember,
  markVaccinationComplete,
  getReminders,
} from '../controllers/vaccinationsController.js';

const router = Router();

router.get('/templates', getTemplates);
router.get('/reminders', authenticate, getReminders);
router.post('/family', authenticate, addFamilyMember);
router.get('/family', authenticate, getFamilyMembers);
router.put('/family/:id', authenticate, updateFamilyMember);
router.delete('/family/:id', authenticate, deleteFamilyMember);
router.put('/records/:id/complete', authenticate, markVaccinationComplete);

export default router;
