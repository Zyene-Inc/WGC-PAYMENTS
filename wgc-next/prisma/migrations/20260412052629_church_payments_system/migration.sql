-- AlterTable
ALTER TABLE "User" ADD COLUMN "merchantId" TEXT;

-- CreateTable
CREATE TABLE "PartnerConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partnerId" TEXT NOT NULL,
    "showFeeBreakdown" BOOLEAN NOT NULL DEFAULT true,
    "showNetOnly" BOOLEAN NOT NULL DEFAULT false,
    "showDonorList" BOOLEAN NOT NULL DEFAULT true,
    "showPayouts" BOOLEAN NOT NULL DEFAULT true,
    "showRecurring" BOOLEAN NOT NULL DEFAULT true,
    "allowRefunds" BOOLEAN NOT NULL DEFAULT false,
    "allowExports" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "PartnerConfig_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Merchant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "slug" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "onboardingStatus" TEXT NOT NULL DEFAULT 'pending',
    "achEnabled" BOOLEAN NOT NULL DEFAULT true,
    "recurringEnabled" BOOLEAN NOT NULL DEFAULT true,
    "cardEnabled" BOOLEAN NOT NULL DEFAULT true,
    "partnerId" TEXT NOT NULL,
    "finixMerchantId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Merchant_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Merchant" ("achEnabled", "createdAt", "email", "finixMerchantId", "id", "name", "onboardingStatus", "partnerId", "recurringEnabled", "status") SELECT "achEnabled", "createdAt", "email", "finixMerchantId", "id", "name", "onboardingStatus", "partnerId", "recurringEnabled", "status" FROM "Merchant";
DROP TABLE "Merchant";
ALTER TABLE "new_Merchant" RENAME TO "Merchant";
CREATE UNIQUE INDEX "Merchant_email_key" ON "Merchant"("email");
CREATE UNIQUE INDEX "Merchant_slug_key" ON "Merchant"("slug");
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "fee" REAL NOT NULL DEFAULT 0,
    "net" REAL NOT NULL DEFAULT 0,
    "method" TEXT NOT NULL DEFAULT 'CARD',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "coverFees" BOOLEAN NOT NULL DEFAULT false,
    "fund" TEXT NOT NULL DEFAULT 'General',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "merchantId" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "finixPaymentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "createdAt", "donorId", "fee", "finixPaymentId", "id", "isRecurring", "merchantId", "method", "net", "status") SELECT "amount", "createdAt", "donorId", "fee", "finixPaymentId", "id", "isRecurring", "merchantId", "method", "net", "status" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PartnerConfig_partnerId_key" ON "PartnerConfig"("partnerId");
