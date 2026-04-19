import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function cleanup() {
  console.log('--- Starting Database Cleanup ---');

  try {
    // 1. Delete all records in dependent tables first
    console.log('Clearing transaction and donor data...');
    await prisma.payment.deleteMany();
    await prisma.payout.deleteMany();
    await prisma.recurringDonation.deleteMany();
    await prisma.donor.deleteMany();
    await prisma.migrationRow.deleteMany();
    await prisma.migrationJob.deleteMany();
    await prisma.migrationRecord.deleteMany();
    await prisma.webhookEvent.deleteMany();
    await prisma.inquiry.deleteMany();
    await prisma.partnerConfig.deleteMany();

    // 2. Delete main entities
    console.log('Clearing users, merchants, and partners...');
    await prisma.user.deleteMany();
    await prisma.merchant.deleteMany();
    await prisma.partner.deleteMany();

    console.log('--- Database Cleared ---');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 3. Create Software Partner
    console.log('Creating Software Partner...');
    const partner = await prisma.partner.create({
      data: {
        name: 'Way Point Gateway',
        apiKey: 'wgc_partner_key_123',
        config: {
          create: {
            showFeeBreakdown: true,
            showNetOnly: false,
          }
        }
      }
    });

    await prisma.user.create({
      data: {
        email: 'partner@wgc.com',
        password: hashedPassword,
        role: 'partner_admin',
      }
    });

    // 4. Create Church Administrator
    console.log('Creating Church Administrator and Grace Church...');
    const merchant = await prisma.merchant.create({
      data: {
        name: 'Grace Church',
        email: 'finance@gracechurch.org',
        slug: 'grace-church',
        status: 'active',
        onboardingStatus: 'completed',
        partnerId: partner.id,
      }
    });

    await prisma.user.create({
      data: {
        email: 'churchadmin@wgc.com',
        password: hashedPassword,
        role: 'church_admin',
        merchantId: merchant.id,
      }
    });

    console.log('--- Setup Complete ---');
    console.log('\nFinal Accounts:');
    console.log('1. Software Partner: partner@wgc.com / password123');
    console.log('2. Church Admin: churchadmin@wgc.com / password123');

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
