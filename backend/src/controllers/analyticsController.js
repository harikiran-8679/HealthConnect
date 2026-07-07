import prisma from '../utils/prisma.js';

export async function trackPageView(req, res, next) {
  try {
    const { path } = req.body;
    if (path) {
      await prisma.pageView.create({ data: { path } });
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(req, res, next) {
  try {
    const totalViews = await prisma.pageView.count();
    const totalTips = await prisma.healthTip.count();
    const totalDiseases = await prisma.disease.count();
    const totalContacts = await prisma.emergencyContact.count();
    const totalWomenChild = await prisma.womenChildContent.count();
    const totalUsers = await prisma.user.count();

    const topPages = await prisma.pageView.groupBy({
      by: ['path'],
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    });

    const recentViews = await prisma.pageView.findMany({
      orderBy: { viewedAt: 'desc' },
      take: 50,
    });

    const viewsByDay = recentViews.reduce((acc, v) => {
      const day = v.viewedAt.toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalViews,
        totalTips,
        totalDiseases,
        totalContacts,
        totalWomenChild,
        totalUsers,
        topPages: topPages.map(p => ({ path: p.path, count: p._count.path })),
        viewsByDay: Object.entries(viewsByDay).map(([date, count]) => ({ date, count })),
      },
    });
  } catch (error) {
    next(error);
  }
}
