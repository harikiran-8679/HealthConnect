import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getTemplates(req, res, next) {
  try {
    const templates = await prisma.vaccinationScheduleTemplate.findMany({
      orderBy: { recommendedAgeDays: 'asc' },
    });
    res.json({ success: true, data: templates });
  } catch (error) {
    next(error);
  }
}

export async function createTemplate(req, res, next) {
  try {
    const { vaccineName, recommendedAgeDays, description } = req.body;
    const template = await prisma.vaccinationScheduleTemplate.create({
      data: { vaccineName, recommendedAgeDays, description },
    });
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
}

export async function updateTemplate(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid template ID', 400);
    const { vaccineName, recommendedAgeDays, description } = req.body;
    const template = await prisma.vaccinationScheduleTemplate.update({
      where: { id: parsedId },
      data: { vaccineName, recommendedAgeDays, description },
    });
    res.json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
}

export async function deleteTemplate(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid template ID', 400);
    await prisma.vaccinationScheduleTemplate.delete({ where: { id: parsedId } });
    res.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    next(error);
  }
}

export async function addFamilyMember(req, res, next) {
  try {
    const { name, dateOfBirth, relation } = req.body;

    const member = await prisma.familyMember.create({
      data: {
        userId: req.user.id,
        name,
        dateOfBirth: new Date(dateOfBirth),
        relation,
      },
    });

    const templates = await prisma.vaccinationScheduleTemplate.findMany();
    const records = templates.map(t => ({
      familyMemberId: member.id,
      vaccineId: t.id,
      dueDate: new Date(new Date(dateOfBirth).getTime() + t.recommendedAgeDays * 24 * 60 * 60 * 1000),
      status: 'pending',
    }));

    if (records.length > 0) {
      await prisma.vaccinationRecord.createMany({ data: records });
    }

    const result = await prisma.familyMember.findUnique({
      where: { id: member.id },
      include: {
        records: {
          include: { vaccine: true },
          orderBy: { dueDate: 'asc' },
        },
      },
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getFamilyMembers(req, res, next) {
  try {
    const members = await prisma.familyMember.findMany({
      where: { userId: req.user.id },
      include: {
        records: {
          include: { vaccine: true },
          orderBy: { dueDate: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
}

export async function updateFamilyMember(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid family member ID', 400);
    const { name, dateOfBirth, relation } = req.body;

    const member = await prisma.familyMember.findFirst({
      where: { id: parsedId, userId: req.user.id },
    });
    if (!member) {
      throw new AppError('Family member not found', 404);
    }

    const updated = await prisma.familyMember.update({
      where: { id: parsedId },
      data: { name, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, relation },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteFamilyMember(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid family member ID', 400);
    const member = await prisma.familyMember.findFirst({
      where: { id: parsedId, userId: req.user.id },
    });
    if (!member) {
      throw new AppError('Family member not found', 404);
    }
    await prisma.familyMember.delete({ where: { id: parsedId } });
    res.json({ success: true, message: 'Family member deleted' });
  } catch (error) {
    next(error);
  }
}

export async function markVaccinationComplete(req, res, next) {
  try {
    const { id } = req.params;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid vaccination record ID', 400);
    const record = await prisma.vaccinationRecord.findUnique({
      where: { id: parsedId },
      include: { familyMember: true },
    });

    if (!record) {
      throw new AppError('Vaccination record not found', 404);
    }
    if (record.familyMember.userId !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized', 403);
    }

    const updated = await prisma.vaccinationRecord.update({
      where: { id: parseInt(id) },
      data: { status: 'completed', completedDate: new Date() },
      include: { vaccine: true },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function getReminders(req, res, next) {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const records = await prisma.vaccinationRecord.findMany({
      where: {
        familyMember: { userId: req.user.id },
        status: 'pending',
        dueDate: { lte: sevenDaysFromNow },
      },
      include: {
        vaccine: true,
        familyMember: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
}
