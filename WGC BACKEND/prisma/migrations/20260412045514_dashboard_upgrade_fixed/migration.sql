-- AlterTable
ALTER TABLE "RecurringDonation" ADD COLUMN "nextBillingDate" DATETIME;

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "arrivalDate" DATETIME,
    "merchantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payout_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Merchant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "onboardingStatus" TEXT NOT NULL DEFAULT 'pending',
    "achEnabled" BOOLEAN NOT NULL DEFAULT true,
    "recurringEnabled" BOOLEAN NOT NULL DEFAULT true,
    "partnerId" TEXT NOT NULL,
    "finixMerchantId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Merchant_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Merchant" ("createdAt", "email", "finixMerchantId", "id", "name", "partnerId", "status") SELECT "createdAt", "email", "finixMerchantId", "id", "name", "partnerId", "status" FROM "Merchant";
DROP TABLE "Merchant";
ALTER TABLE "new_Merchant" RENAME TO "Merchant";
CREATE UNIQUE INDEX "Merchant_email_key" ON "Merchant"("email");
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "fee" REAL NOT NULL DEFAULT 0,
    "net" REAL NOT NULL DEFAULT 0,
    "method" TEXT NOT NULL DEFAULT 'CARD',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "merchantId" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "finixPaymentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "createdAt", "donorId", "finixPaymentId", "id", "merchantId", "status") SELECT "amount", "createdAt", "donorId", "finixPaymentId", "id", "merchantId", "status" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
