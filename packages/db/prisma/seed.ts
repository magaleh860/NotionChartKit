import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@notionchartkit.com' },
    update: {},
    create: {
      email: 'demo@notionchartkit.com',
      name: 'Demo User',
    },
  });

  console.log('Created user:', user);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
