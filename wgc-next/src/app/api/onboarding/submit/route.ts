import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { userId: string };
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { organization: { include: { application: true } } }
    });

    if (!user || !user.organization) {
      return NextResponse.json({ message: "Organization not found" }, { status: 404 });
    }

    // Update organization and application
    await prisma.$transaction([
      prisma.organization.update({
        where: { id: user.organization.id },
        data: {
          legalName: body.legalName,
          dbaName: body.dbaName,
          entityType: body.entityType,
          ein: body.ein,
          stateOfFormation: body.stateOfFormation,
          address: body.address,
          city: body.city,
          state: body.state,
          zip: body.zip,
          website: body.website,
          primaryContactName: body.primaryContactName,
          primaryContactEmail: body.primaryContactEmail,
          primaryContactPhone: body.primaryContactPhone,
        }
      }),
      prisma.authorizedRepresentative.create({
        data: {
          organizationId: user.organization.id,
          legalName: body.repName,
          title: body.repTitle,
          dob: body.repDob,
          ssnItinLast4: body.repSsnLast4,
          email: body.repEmail,
          phone: body.repPhone,
          residentialAddress: body.repAddress,
        }
      }),
      prisma.onboardingApplication.update({
        where: { id: user.organization.application?.id },
        data: {
          status: "submitted",
          submittedAt: new Date(),
          estimatedMonthlyVolume: parseFloat(body.monthlyVolume) || 0,
          averageTransactionSize: parseFloat(body.avgTx) || 0,
          largestExpectedTransaction: parseFloat(body.maxTx) || 0,
          primaryFundingSource: body.fundingSource,
          processingUseCase: body.useCase,
          organizationPurpose: body.mission,
          acceptAch: body.acceptAch,
          acceptCard: body.acceptCard,
          recurringDonations: body.recurring,
          textToGive: body.textToGive,
        }
      }),
      prisma.applicationEvent.create({
        data: {
          applicationId: user.organization.application!.id,
          eventType: "status_change",
          message: "Application submitted for review.",
        }
      })
    ]);

    // Note: In a real app, trigger email here

    return NextResponse.json({ status: "success", message: "Application submitted" });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
