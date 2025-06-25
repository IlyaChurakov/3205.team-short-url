import prisma from '../../db';

describe('Short URL creation', () => {
  const testAlias = 'unique-alias-' + Date.now();

  afterAll(async () => {
    await prisma.shortUrl.deleteMany({ where: { alias: testAlias } });
    await prisma.$disconnect();
  });

  it('should create a short URL with a unique alias', async () => {
    const data = await prisma.shortUrl.create({
      data: {
        originalUrl: 'https://example.com',
        alias: testAlias,
      },
    });

    expect(data).toHaveProperty('alias', testAlias);
  });
});
