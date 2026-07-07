import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export async function list(req, res, next) {
  try {
    const { category, language, page = 1, limit = 20 } = req.query;
    const lang = language || req.user?.preferredLanguage || 'en';
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (category) {
      where.category = category;
    }

    const tips = await prisma.healthTip.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        translations: {
          where: { languageCode: lang },
        },
      },
    });

    const total = await prisma.healthTip.count({ where });

    const data = tips.map(tip => ({
      id: tip.id,
      category: tip.category,
      imageUrl: tip.imageUrl,
      createdAt: tip.createdAt,
      title: tip.translations[0]?.title || null,
      description: tip.translations[0]?.description || null,
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
    if (isNaN(parsedId)) throw new AppError('Invalid health tip ID', 400);
    const lang = req.query.language || req.user?.preferredLanguage || 'en';

    const tip = await prisma.healthTip.findUnique({
      where: { id: parsedId },
      include: {
        translations: {
          where: { languageCode: lang },
        },
      },
    });

    if (!tip) {
      throw new AppError('Health tip not found', 404);
    }

    res.json({
      success: true,
      data: {
        id: tip.id,
        category: tip.category,
        imageUrl: tip.imageUrl,
        createdAt: tip.createdAt,
        title: tip.translations[0]?.title || null,
        description: tip.translations[0]?.description || null,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const { category, imageUrl, translations } = req.body;

    const tip = await prisma.healthTip.create({
      data: {
        category,
        imageUrl,
        translations: {
          create: translations.map(t => ({
            languageCode: t.languageCode,
            title: t.title,
            description: t.description,
          })),
        },
      },
      include: { translations: true },
    });

    res.status(201).json({ success: true, data: tip });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid health tip ID', 400);
    const { category, imageUrl, translations } = req.body;

    const existing = await prisma.healthTip.findUnique({ where: { id: parsedId } });
    if (!existing) {
      throw new AppError('Health tip not found', 404);
    }

    const tip = await prisma.healthTip.update({
      where: { id: parsedId },
      data: {
        category,
        imageUrl,
        translations: {
          deleteMany: {},
          create: translations.map(t => ({
            languageCode: t.languageCode,
            title: t.title,
            description: t.description,
          })),
        },
      },
      include: { translations: true },
    });

    res.json({ success: true, data: tip });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new AppError('Invalid health tip ID', 400);
    await prisma.healthTip.delete({ where: { id: parsedId } });
    res.json({ success: true, message: 'Health tip deleted' });
  } catch (error) {
    next(error);
  }
}
