-- CreateTable
CREATE TABLE "MigrationJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "fileName" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "validRows" INTEGER NOT NULL DEFAULT 0,
    "errorRows" INTEGER NOT NULL DEFAULT 0,
    "importedRows" INTEGER NOT NULL DEFAULT 0,
    "skippedRows" INTEGER NOT NULL DEFAULT 0,
    "columnMapping" TEXT NOT NULL DEFAULT '{}',
    "errors" TEXT NOT NULL DEFAULT '[]',
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MigrationRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "rowIndex" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "validationError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MigrationRow_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "MigrationJob" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
