import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true,

                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeUsers = users.map(user => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
        }));

        return NextResponse.json(safeUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
}
