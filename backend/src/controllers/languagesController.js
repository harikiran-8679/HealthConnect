import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export async function list(req, res, next) {
  try {
    const languages = await prisma.language.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: languages });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const { code, name } = req.body;
    const existing = await prisma.language.findUnique({ where: { code } });
    if (existing) {
      throw new AppError('Language already exists', 409);
    }
    const language = await prisma.language.create({
      data: { code, name },
    });
    res.status(201).json({ success: true, data: language });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.language.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Language deleted' });
  } catch (error) {
    next(error);
  }
}
