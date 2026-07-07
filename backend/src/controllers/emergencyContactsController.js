import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export async function list(req, res, next) {
  try {
    const { type, state, district, village, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (type) where.type = type;
    if (state) where.state = state;
    if (district) where.district = district;
    if (village) where.village = village;

    const contacts = await prisma.emergencyContact.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { type: 'asc' },
    });

    const total = await prisma.emergencyContact.count({ where });

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid contact ID', 400);
    const contact = await prisma.emergencyContact.findUnique({
      where: { id: parsedId },
    });
    if (!contact) {
      throw new AppError('Emergency contact not found', 404);
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const { name, phone, type, state, district, village } = req.body;
    const contact = await prisma.emergencyContact.create({
      data: { name, phone, type, state, district, village },
    });
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid contact ID', 400);
    const { name, phone, type, state, district, village } = req.body;

    const existing = await prisma.emergencyContact.findUnique({ where: { id: parsedId } });
    if (!existing) {
      throw new AppError('Emergency contact not found', 404);
    }

    const contact = await prisma.emergencyContact.update({
      where: { id: parsedId },
      data: { name, phone, type, state, district, village },
    });

    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid contact ID', 400);
    await prisma.emergencyContact.delete({ where: { id: parsedId } });
    res.json({ success: true, message: 'Emergency contact deleted' });
  } catch (error) {
    next(error);
  }
}
