import { NextFunction, Request, Response } from 'express';
import prisma from '../db';
import ApiError from '../errors/api.error';
import { getClientIp } from 'request-ip';
import { CreateShortUrlBodySchemaType } from '../schema';
import { nanoid } from 'nanoid';

export async function createShortUrl(
  req: Request<{}, {}, CreateShortUrlBodySchemaType>,
  res: Response<{}>,
  next: NextFunction,
) {
  try {
    const { originalUrl, expiresAt, alias } = req.body;

    if (alias) {
      const isShortUrlWithSameAliasExists = await prisma.shortUrl.findUnique({ where: { alias } });
      if (isShortUrlWithSameAliasExists)
        throw ApiError.BadRequest('Ссылка с таким алиасом уже существует');
    }

    const shortUrl = await prisma.shortUrl.create({
      data: {
        originalUrl,
        expiresAt,
        alias: alias || nanoid(20),
      },
    });

    res.status(200).json(shortUrl);
  } catch (e) {
    return next(e);
  }
}

export async function redirectToOriginalUrl(req: Request, res: Response<{}>, next: NextFunction) {
  try {
    const { shortUrl } = req.params;

    const data = await prisma.shortUrl.findUnique({
      where: {
        alias: shortUrl,
      },
    });

    if (!data) throw ApiError.NotFound('Ссылка не найдена');

    const currentDate = new Date();

    if (data.expiresAt && data.expiresAt < currentDate)
      throw ApiError.Gone('Срок действия ссылки истёк');

    // TODO: Разобраться с ip
    const ip = getClientIp(req) || 'unknown';

    await prisma.analytics.create({
      data: {
        shortUrlId: data.id,
        ip,
      },
    });

    res.redirect(data.originalUrl);
  } catch (e) {
    return next(e);
  }
}

export async function getShortUrlInfo(req: Request, res: Response<{}>, next: NextFunction) {
  try {
    const { shortUrl } = req.params;

    const data = await prisma.shortUrl.findUnique({
      where: {
        alias: shortUrl,
      },
    });

    if (!data) throw ApiError.NotFound('Ссылка не найдена');

    const clickCount = await prisma.analytics.count({
      where: {
        shortUrlId: data.id,
      },
    });

    res.status(200).json({
      createdAt: data.createdAt,
      originalUrl: data.originalUrl,
      clickCount,
    });
  } catch (e) {
    return next(e);
  }
}

export async function deleteShortUrl(req: Request, res: Response<{}>, next: NextFunction) {
  try {
    const { shortUrl } = req.params;

    const data = await prisma.shortUrl.delete({
      where: {
        alias: shortUrl,
      },
    });

    if (!data) throw ApiError.NotFound('Ссылка не найдена');

    res.status(200).json({
      message: 'Ссылка удалена',
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
}

export async function getAnalytics(req: Request, res: Response<{}>, next: NextFunction) {
  try {
    const { shortUrl } = req.params;
    if (!shortUrl) throw ApiError.BadRequest('Не указан алиас ссылки');

    const data = await prisma.shortUrl.findUnique({
      where: {
        alias: shortUrl,
      },
    });

    if (!data) throw ApiError.NotFound('Ссылка не найдена');

    const clickCount = await prisma.analytics.count({
      where: {
        shortUrlId: data.id,
      },
    });

    const lastIps = await prisma.analytics.findMany({
      where: {
        shortUrlId: data.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      select: {
        ip: true,
      },
    });

    res.status(200).json({
      clickCount,
      lastIps,
    });
  } catch (e) {
    return next(e);
  }
}
