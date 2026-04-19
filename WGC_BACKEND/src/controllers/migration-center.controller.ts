import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';

// Required fields per import type
const REQUIRED_FIELDS: Record<string, string[]> = {
  churches:     ['name', 'email'],
  donors:       ['name', 'email', 'church_name'],
  transactions: ['donor_email', 'church_name', 'amount', 'date', 'method'],
  recurring:    ['donor_email', 'church_name', 'amount', 'frequency', 'status'],
};

// ──── Upload & Create Job ────
export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, fileName, rows } = req.body; // rows = parsed CSV array of objects

    if (!REQUIRED_FIELDS[type]) {
      res.status(400).json({ message: `Invalid import type: ${type}. Must be one of: ${Object.keys(REQUIRED_FIELDS).join(', ')}` });
      return;
    }
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      res.status(400).json({ message: 'No rows provided' });
      return;
    }

    const job = await prisma.migrationJob.create({
      data: {
        type,
        fileName: fileName || `${type}_import.csv`,
        status: 'pending',
        totalRows: rows.length,
      }
    });

    // Create individual row records
    await prisma.migrationRow.createMany({
      data: rows.map((row: any, index: number) => ({
        jobId: job.id,
        rowIndex: index,
        data: JSON.stringify(row),
        status: 'pending',
      }))
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// ──── Validate Job ────
export const validateJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const job = await prisma.migrationJob.findUnique({ where: { id } });
    if (!job) { res.status(404).json({ message: 'Job not found' }); return; }

    const requiredFields = REQUIRED_FIELDS[job.type];
    const rows = await prisma.migrationRow.findMany({ where: { jobId: id } });
    
    let validCount = 0;
    let errorCount = 0;
    const errors: any[] = [];

    for (const row of rows) {
      const data = JSON.parse(row.data);
      const missing = requiredFields.filter(f => !data[f] || String(data[f]).trim() === '');
      
      if (missing.length > 0) {
        await prisma.migrationRow.update({
          where: { id: row.id },
          data: { status: 'invalid', validationError: `Missing required fields: ${missing.join(', ')}` }
        });
        errorCount++;
        errors.push({ row: row.rowIndex + 1, fields: missing });
      } else {
        // For recurring imports, flag plans that need donor reauthorization
        let warning = null;
        if (job.type === 'recurring' && !data.payment_token) {
          warning = 'No payment token — donor will need to reauthorize';
        }
        await prisma.migrationRow.update({
          where: { id: row.id },
          data: { 
            status: 'valid', 
            validationError: warning 
          }
        });
        validCount++;
      }
    }

    await prisma.migrationJob.update({
      where: { id },
      data: { 
        status: 'previewing', 
        validRows: validCount, 
        errorRows: errorCount,
        errors: JSON.stringify(errors)
      }
    });

    res.json({ 
      jobId: id, 
      status: 'previewing', 
      totalRows: job.totalRows, 
      validRows: validCount, 
      errorRows: errorCount,
      errors
    });
  } catch (error) {
    next(error);
  }
};

// ──── Save Column Mapping ────
export const updateMapping = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { mapping } = req.body;
    const job = await prisma.migrationJob.update({
      where: { id },
      data: { columnMapping: JSON.stringify(mapping) }
    });
    res.json(job);
  } catch (error) {
    next(error);
  }
};

// ──── Get Job Preview (rows) ────
export const getJobPreview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const job = await prisma.migrationJob.findUnique({ where: { id } });
    if (!job) { res.status(404).json({ message: 'Job not found' }); return; }

    const rows = await prisma.migrationRow.findMany({
      where: { jobId: id },
      orderBy: { rowIndex: 'asc' },
      take: 100,
    });

    res.json({
      job,
      rows: rows.map(r => ({
        ...r,
        data: JSON.parse(r.data)
      }))
    });
  } catch (error) {
    next(error);
  }
};

// ──── Confirm Import ────
export const confirmImport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const job = await prisma.migrationJob.findUnique({ where: { id } });
    if (!job) { res.status(404).json({ message: 'Job not found' }); return; }

    await prisma.migrationJob.update({
      where: { id },
      data: { status: 'importing' }
    });

    // Simulate import processing
    const validRows = await prisma.migrationRow.findMany({
      where: { jobId: id, status: 'valid' }
    });

    let importedCount = 0;
    let skippedCount = 0;

    for (const row of validRows) {
      try {
        // Mark as imported (actual Finix/DB integration would go here)
        await prisma.migrationRow.update({
          where: { id: row.id },
          data: { status: 'imported' }
        });
        importedCount++;
      } catch (e) {
        await prisma.migrationRow.update({
          where: { id: row.id },
          data: { status: 'skipped', validationError: 'Import failed' }
        });
        skippedCount++;
      }
    }

    await prisma.migrationJob.update({
      where: { id },
      data: { 
        status: 'completed', 
        importedRows: importedCount,
        skippedRows: skippedCount,
        completedAt: new Date()
      }
    });

    res.json({ 
      jobId: id, 
      status: 'completed', 
      importedRows: importedCount, 
      skippedRows: skippedCount 
    });
  } catch (error) {
    next(error);
  }
};

// ──── List All Jobs ────
export const listJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await prisma.migrationJob.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

// ──── Get Job Detail ────
export const getJobDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const job = await prisma.migrationJob.findUnique({ 
      where: { id },
      include: {
        rows: { orderBy: { rowIndex: 'asc' } }
      }
    });
    if (!job) { res.status(404).json({ message: 'Job not found' }); return; }

    res.json({
      ...job,
      errors: JSON.parse(job.errors),
      columnMapping: JSON.parse(job.columnMapping),
      rows: job.rows.map(r => ({
        ...r,
        data: JSON.parse(r.data)
      }))
    });
  } catch (error) {
    next(error);
  }
};

// ──── Migration Summary Stats ────
export const getMigrationSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalJobs = await prisma.migrationJob.count();
    const completedJobs = await prisma.migrationJob.count({ where: { status: 'completed' } });

    // Count imported rows by type  
    const churchJobs = await prisma.migrationJob.findMany({ where: { type: 'churches', status: 'completed' } });
    const donorJobs = await prisma.migrationJob.findMany({ where: { type: 'donors', status: 'completed' } });
    const txJobs = await prisma.migrationJob.findMany({ where: { type: 'transactions', status: 'completed' } });
    const recurringJobs = await prisma.migrationJob.findMany({ where: { type: 'recurring', status: 'completed' } });

    const importedChurches = churchJobs.reduce((sum, j) => sum + j.importedRows, 0);
    const importedDonors = donorJobs.reduce((sum, j) => sum + j.importedRows, 0);
    const importedTransactions = txJobs.reduce((sum, j) => sum + j.importedRows, 0);
    const importedRecurring = recurringJobs.reduce((sum, j) => sum + j.importedRows, 0);

    // Plans needing reauth
    const recurringRows = await prisma.migrationRow.findMany({
      where: { 
        job: { type: 'recurring' },
        status: 'imported',
        validationError: { not: null }
      }
    });
    const needsReauth = recurringRows.length;

    // Failed rows needing review
    const failedRows = await prisma.migrationRow.count({ where: { status: 'invalid' } });

    res.json({
      totalJobs,
      completedJobs,
      importedChurches,
      importedDonors,
      importedTransactions,
      importedRecurring,
      needsReauth,
      failedRows
    });
  } catch (error) {
    next(error);
  }
};
