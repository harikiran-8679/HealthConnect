import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Controller', () => {
  before(async () => {
    await prisma.user.deleteMany({ where: { email: 'test@test.com' } });
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { email: 'test@test.com' } });
    await prisma.$disconnect();
  });

  it('should hash passwords correctly', async () => {
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash('test123', 12);
    const isValid = await bcrypt.compare('test123', hash);
    assert.ok(isValid);
    const isInvalid = await bcrypt.compare('wrong', hash);
    assert.ok(!isInvalid);
  });

  it('should create and find a user', async () => {
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash('test123', 12);

    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@test.com',
        passwordHash: hash,
        role: 'user',
      },
    });

    assert.ok(user.id);
    assert.equal(user.email, 'test@test.com');
    assert.equal(user.name, 'Test User');

    const found = await prisma.user.findUnique({ where: { email: 'test@test.com' } });
    assert.ok(found);
    assert.equal(found.id, user.id);
  });

  it('should enforce unique email constraint', async () => {
    const bcrypt = await import('bcrypt');
    const hash = await bcrypt.hash('test123', 12);

    await assert.rejects(
      prisma.user.create({
        data: {
          name: 'Duplicate',
          email: 'test@test.com',
          passwordHash: hash,
          role: 'user',
        },
      })
    );
  });
});
