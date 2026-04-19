import prisma from '../prisma/client';
import logger from '../utils/logger';

export class MigrationService {
  async importDonors(merchantId: string, donors: { email: string; name?: string }[]) {
    logger.info(`Importing ${donors.length} donors for merchant ${merchantId}`);
    
    const records = await Promise.all(
      donors.map(donor => 
        prisma.migrationRecord.create({
          data: {
            donorEmail: donor.email,
            merchantId,
            status: 'pending',
          },
        })
      )
    );

    return records;
  }

  async sendMigrationLinks(merchantId: string) {
    logger.info(`Simulating sending migration links for merchant ${merchantId}`);
    
    await prisma.migrationRecord.updateMany({
      where: { merchantId, status: 'pending' },
      data: { status: 'sent' },
    });

    return { message: 'Migration links sent successfully' };
  }

  async getMigrationStatus(merchantId: string) {
    const total = await prisma.migrationRecord.count({ where: { merchantId } });
    const pending = await prisma.migrationRecord.count({ where: { merchantId, status: 'pending' } });
    const sent = await prisma.migrationRecord.count({ where: { merchantId, status: 'sent' } });
    const updated = await prisma.migrationRecord.count({ where: { merchantId, status: 'updated' } });

    return {
      total,
      pending,
      sent,
      updated,
      percentageMigrated: total > 0 ? (updated / total) * 100 : 0,
    };
  }

  async resendMigrationLink(merchantId: string, donorEmail: string) {
    logger.info(`Resending migration link to ${donorEmail} for merchant ${merchantId}`);
    
    await prisma.migrationRecord.updateMany({
      where: { merchantId, donorEmail },
      data: { status: 'sent' },
    });

    return { message: `Link resent to ${donorEmail}` };
  }
}

export const migrationService = new MigrationService();
