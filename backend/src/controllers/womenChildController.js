import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export async function list(req, res, next) {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const language = req.query.language || req.user?.preferredLanguage || 'en';
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (category) where.category = category;

    const items = await prisma.womenChildContent.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        translations: {
          where: { languageCode: language },
        },
      },
    });

    const total = await prisma.womenChildContent.count({ where });

    const data = items.map(item => ({
      id: item.id,
      category: item.category,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
      title: item.translations[0]?.title || null,
      body: item.translations[0]?.body || null,
    }));

    res.json({
      success: true,
      data,
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
    if (isNaN(parsedId)) throw new AppError('Invalid content ID', 400);
    const language = req.query.language || req.user?.preferredLanguage || 'en';

    const item = await prisma.womenChildContent.findUnique({
      where: { id: parsedId },
      include: {
        translations: {
          where: { languageCode: language },
        },
      },
    });

    if (!item) {
      throw new AppError('Content not found', 404);
    }

    res.json({
      success: true,
      data: {
        id: item.id,
        category: item.category,
        imageUrl: item.imageUrl,
        title: item.translations[0]?.title || null,
        body: item.translations[0]?.body || null,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const { category, imageUrl, translations } = req.body;

    const content = await prisma.womenChildContent.create({
      data: {
        category,
        imageUrl,
        translations: {
          create: translations.map(t => ({
            languageCode: t.languageCode,
            title: t.title,
            body: t.body,
          })),
        },
      },
      include: { translations: true },
    });

    res.status(201).json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid content ID', 400);
    const { category, imageUrl, translations } = req.body;

    const existing = await prisma.womenChildContent.findUnique({ where: { id: parsedId } });
    if (!existing) {
      throw new AppError('Content not found', 404);
    }

    const content = await prisma.womenChildContent.update({
      where: { id: parsedId },
      data: {
        category,
        imageUrl,
        translations: {
          deleteMany: {},
          create: translations.map(t => ({
            languageCode: t.languageCode,
            title: t.title,
            body: t.body,
          })),
        },
      },
      include: { translations: true },
    });

    res.json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid content ID', 400);
    await prisma.womenChildContent.delete({ where: { id: parsedId } });
    res.json({ success: true, message: 'Content deleted' });
  } catch (error) {
    next(error);
  }
}
