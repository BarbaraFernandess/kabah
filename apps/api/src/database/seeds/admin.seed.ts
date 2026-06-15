import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedAdmin(prisma: PrismaClient): Promise<void> {
  const email = process.env['ADMIN_EMAIL'] ?? 'admin@kabah.app';
  const password = process.env['ADMIN_PASSWORD'] ?? 'Admin@2025!';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });
}
