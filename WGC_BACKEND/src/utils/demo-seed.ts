import prisma from '../prisma/client';
import bcrypt from 'bcryptjs';
import logger from './logger';
import { v4 as uuidv4 } from 'uuid';

export async function seedDemoData() {
  const logs: string[] = [];
  try {
    logs.push('🌱 Starting WGC Platform Demo Seeding...');

    // 1. Create/Update Demo Partner
    const partner = await prisma.partner.upsert({
      where: { apiKey: 'wgc_demo_partner_key_123' },
      update: {},
      create: {
        id: uuidv4(),
        name: 'WGC Demo Ecosystem',
        apiKey: 'wgc_demo_partner_key_123',
      }
    });
    logs.push('✅ Partner ensured.');

    // 2. Create Partner Config
    await prisma.partnerConfig.upsert({
      where: { partnerId: partner.id },
      update: {},
      create: {
        partnerId: partner.id,
        showFeeBreakdown: true,
        showNetOnly: false,
        showDonorList: true,
        showPayouts: true,
        showRecurring: true,
      }
    });
    logs.push('✅ Partner config ensured.');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 3. Clean and Recreate Software Partner Admin
    await prisma.user.deleteMany({ where: { email: 'partner@wgc.com' } });
    await prisma.user.create({
      data: {
        email: 'partner@wgc.com',
        password: hashedPassword,
        role: 'partner_admin'
      }
    });
    logs.push('👤 Partner Admin account provisioned.');

    // 4. Create Demo Merchant (Church)
    const merchant = await prisma.merchant.upsert({
      where: { email: 'finance@gracechurch.org' },
      update: { name: 'Grace Church of Way Point' },
      create: {
        name: 'Grace Church of Way Point',
        email: 'finance@gracechurch.org',
        slug: 'grace-church',
        status: 'active',
        onboardingStatus: 'complete',
        partnerId: partner.id,
        finixMerchantId: 'ent_demo_123456789'
      }
    });
    logs.push('✅ Merchant (Grace Church) ensured.');

    // 5. Clean and Recreate Church Admin User linked to Merchant
    await prisma.user.deleteMany({ where: { email: 'admin@gracechurch.org' } });
    await prisma.user.create({
      data: {
        email: 'admin@gracechurch.org',
        password: hashedPassword,
        role: 'church_admin',
        merchantId: merchant.id
      }
    });
    logs.push('⛪ Church Admin account provisioned.');

    return logs;
  } catch (error: any) {
    logs.push(`❌ Error: ${error.message}`);
    console.error('Seeding error:', error);
    return logs;
  }
}
