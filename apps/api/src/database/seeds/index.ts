import { PrismaClient } from '@prisma/client';
import { seedInterpretations } from './interpretations.seed.js';
import { seedAdmin } from './admin.seed.js';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');
  await seedAdmin(prisma);
  console.log('  ✓ Admin user created');
  await seedInterpretations(prisma);
  console.log('  ✓ Interpretations seeded');
  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
