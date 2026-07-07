import prisma from '../utils/prisma.js';

async function safeQuery(queryFn, fallback = []) {
  try {
    return await queryFn();
  } catch {
    return fallback;
  }
}

function parseLimit(val, defaultVal) {
  const parsed = parseInt(val);
  return isNaN(parsed) || parsed < 1 ? defaultVal : parsed;
}

export async function search(req, res, next) {
  try {
    const { q, language = 'en', page = 1, limit = 20 } = req.query;
    const take = parseLimit(limit, 20);

    if (!q || q.trim().length < 2) {
      return res.json({ success: true, data: [] });
    }

    const query = q.trim();

    const [healthTips, diseases, womenChild] = await Promise.all([
      safeQuery(() =>
        prisma.healthTip.findMany({
          where: {
            translations: {
              some: {
                languageCode: language,
                OR: [
                  { title: { contains: query, mode: 'insensitive' } },
                  { description: { contains: query, mode: 'insensitive' } },
                ],
              },
            },
          },
          include: {
            translations: {
              where: { languageCode: language },
            },
          },
          take,
        })
      ),
      safeQuery(() =>
        prisma.disease.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              {
                translations: {
                  some: {
                    languageCode: language,
                    OR: [
                      { symptoms: { contains: query, mode: 'insensitive' } },
                      { prevention: { contains: query, mode: 'insensitive' } },
                      { careTips: { contains: query, mode: 'insensitive' } },
                    ],
                  },
                },
              },
            ],
          },
          include: {
            translations: {
              where: { languageCode: language },
            },
          },
          take,
        })
      ),
      safeQuery(() =>
        prisma.womenChildContent.findMany({
          where: {
            translations: {
              some: {
                languageCode: language,
                OR: [
                  { title: { contains: query, mode: 'insensitive' } },
                  { body: { contains: query, mode: 'insensitive' } },
                ],
              },
            },
          },
          include: {
            translations: {
              where: { languageCode: language },
            },
          },
          take,
        })
      ),
    ]);

    const results = [
      ...healthTips.map(t => ({
        type: 'health_tip',
        id: t.id,
        title: t.translations[0]?.title || '',
        description: t.translations[0]?.description || '',
        category: t.category,
        imageUrl: t.imageUrl,
      })),
      ...diseases.map(d => ({
        type: 'disease',
        id: d.id,
        title: d.name,
        description: d.translations[0]?.symptoms || '',
        imageUrl: d.imageUrl,
      })),
      ...womenChild.map(w => ({
        type: 'women_child',
        id: w.id,
        title: w.translations[0]?.title || '',
        description: w.translations[0]?.body || '',
        category: w.category,
        imageUrl: w.imageUrl,
      })),
    ];

    res.json({
      success: true,
      data: results.slice(0, take),
    });
  } catch (error) {
    next(error);
  }
}
