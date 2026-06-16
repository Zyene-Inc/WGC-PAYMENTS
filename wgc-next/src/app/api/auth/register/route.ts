import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  organizationName: z.string().min(2),
  role: z.enum(["wgc_admin", "partner_admin", "church_admin"]).default("church_admin"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, organizationName, role } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role,
        organization: {
          create: {
            legalName: organizationName,
            application: {
              create: {
                status: "draft",
              }
            }
          }
        }
      },
      include: {
        organization: {
          include: {
            application: true
          }
        }
      }
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "24h" }
    );

    return NextResponse.json({
      status: "success",
      message: "User registered successfully",
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        fullName: user.fullName,
        organizationId: user.organization?.id,
        applicationId: user.organization?.application?.id
      },
    }, { status: 201 });
  } catch (error) {

    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
