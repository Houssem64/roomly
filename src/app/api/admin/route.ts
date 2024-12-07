import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email }
        });

        if (existingAdmin) {
            return NextResponse.json(
                { error: "Admin already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create admin
        const admin = await prisma.admin.create({
            data: {
                email,
                hashedPassword,
            }
        });

        return NextResponse.json({
            id: admin.id,
            email: admin.email,
        }, { status: 201 });

    } catch (error) {
        console.error("ADMIN_REGISTRATION_ERROR", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Optional: GET method to fetch all admins (protected route)
export async function GET() {
    try {
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                email: true,
                createdAt: true,
                // Exclude hashedPassword for security
            }
        });

        return NextResponse.json(admins, { status: 200 });
    } catch (error) {
        console.error("FETCH_ADMINS_ERROR", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}