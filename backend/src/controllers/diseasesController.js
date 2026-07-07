import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export async function list(req, res, next) {
  try {
    const language = req.query.language || req.user?.preferredLanguage || 'en';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const diseases = await prisma.disease.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        translations: {
          where: { languageCode: language },
        },
      },
    });

    const total = await prisma.disease.count();

    const data = diseases.map(d => ({
      id: d.id,
      name: d.name,
      imageUrl: d.imageUrl,
      createdAt: d.createdAt,
      symptoms: d.translations[0]?.symptoms || null,
      prevention: d.translations[0]?.prevention || null,
      careTips: d.translations[0]?.careTips || null,
    }));

    res.json({
      success: true,
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid disease ID', 400);
    const language = req.query.language || req.user?.preferredLanguage || 'en';

    const disease = await prisma.disease.findUnique({
      where: { id: parsedId },
      include: {
        translations: {
          where: { languageCode: language },
        },
      },
    });

    if (!disease) {
      throw new AppError('Disease not found', 404);
    }

    res.json({
      success: true,
      data: {
        id: disease.id,
        name: disease.name,
        imageUrl: disease.imageUrl,
        symptoms: disease.translations[0]?.symptoms || null,
        prevention: disease.translations[0]?.prevention || null,
        careTips: disease.translations[0]?.careTips || null,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const { name, imageUrl, translations } = req.body;

    const disease = await prisma.disease.create({
      data: {
        name,
        imageUrl,
        translations: {
          create: translations.map(t => ({
            languageCode: t.languageCode,
            symptoms: t.symptoms,
            prevention: t.prevention,
            careTips: t.careTips,
          })),
        },
      },
      include: { translations: true },
    });

    res.status(201).json({ success: true, data: disease });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid disease ID', 400);
    const { name, imageUrl, translations } = req.body;

    const existing = await prisma.disease.findUnique({ where: { id: parsedId } });
    if (!existing) {
      throw new AppError('Disease not found', 404);
    }

    const disease = await prisma.disease.update({
      where: { id: parsedId },
      data: {
        name,
        imageUrl,
        translations: {
          deleteMany: {},
          create: translations.map(t => ({
            languageCode: t.languageCode,
            symptoms: t.symptoms,
            prevention: t.prevention,
            careTips: t.careTips,
          })),
        },
      },
      include: { translations: true },
    });

    res.json({ success: true, data: disease });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid disease ID', 400);
    await prisma.disease.delete({ where: { id: parsedId } });
    res.json({ success: true, message: 'Disease deleted' });
  } catch (error) {
    next(error);
  }
}
