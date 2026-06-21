import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Event Config (idempotent)
  const existingConfig = await prisma.eventConfig.findFirst();
  if (!existingConfig) {
    const config = await prisma.eventConfig.create({
      data: {
        eventName: 'AWS Community Day REC 2026',
        registrationPrefix: 'AWSCD2026',
        eventDate: new Date('2026-09-12T09:00:00Z'),
        registrationsOpen: true,
        goodiesEnabled: true,
      },
    });
    console.log('Created default EventConfig:', config);
  } else {
    console.log('EventConfig already exists, skipping.');
  }

  // 2. Seed Default Organizer (idempotent)
  const organizerEmail = 'organizer@awscommunityday.com';
  const organizerPassword = 'Admin@123';
  const passwordHash = await bcrypt.hash(organizerPassword, 10);

  const organizer = await prisma.user.upsert({
    where: { email: organizerEmail },
    update: {
      passwordHash, // Keep the password as seed value if updated or reset
    },
    create: {
      email: organizerEmail,
      name: 'Default Organizer',
      phone: '+919999988888',
      passwordHash,
      role: UserRole.ORGANIZER,
      organization: 'AWS Student Builder Groups REC',
      designation: 'Event Lead',
      city: 'Chennai',
      avatar: 'man',
      isActive: true,
      mustChangePassword: true,
    },
  });

  console.log('Organizer user seeded:', organizer.email);
  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
