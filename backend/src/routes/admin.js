import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { create as createTip, update as updateTip, remove as deleteTip } from '../controllers/healthTipsController.js';
import { create as createDisease, update as updateDisease, remove as deleteDisease } from '../controllers/diseasesController.js';
import { createTemplate, updateTemplate, deleteTemplate } from '../controllers/vaccinationsController.js';
import { create as createContact, update as updateContact, remove as deleteContact } from '../controllers/emergencyContactsController.js';
import { create as createWomenChild, update as updateWomenChild, remove as deleteWomenChild } from '../controllers/womenChildController.js';
import { create as createLanguage, remove as deleteLanguage } from '../controllers/languagesController.js';
import prisma from '../utils/prisma.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.post('/health-tips', createTip);
router.put('/health-tips/:id', updateTip);
router.delete('/health-tips/:id', deleteTip);

router.post('/diseases', createDisease);
router.put('/diseases/:id', updateDisease);
router.delete('/diseases/:id', deleteDisease);

router.post('/vaccination-templates', createTemplate);
router.put('/vaccination-templates/:id', updateTemplate);
router.delete('/vaccination-templates/:id', deleteTemplate);

router.post('/emergency-contacts', createContact);
router.put('/emergency-contacts/:id', updateContact);
router.delete('/emergency-contacts/:id', deleteContact);

router.post('/women-child', createWomenChild);
router.put('/women-child/:id', updateWomenChild);
router.delete('/women-child/:id', deleteWomenChild);

router.post('/languages', createLanguage);
router.delete('/languages/:id', deleteLanguage);

// Fetch registered community users - Admin only
router.get('/community-users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'user' },
      select: {
        name: true,
        role: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
});

export default router;
