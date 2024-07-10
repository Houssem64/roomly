import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";




export async function POST(
    request: Request
) {
    const body = await request.json();
    const {
        email,
        name,
        password,
        phoneNumber
    } = body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction([
        prisma.user.create({
            data: {
                email,
                name,
                phoneNumber,
                hashedPassword,
            },
        }),
    ]);
    return NextResponse.json(user);
}