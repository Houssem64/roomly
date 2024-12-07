import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

import prisma from "@/app/libs/prismadb";


export async function getSession() {
    return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null;
        }

        // Check if user is admin
        const admin = await prisma.admin.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (admin) {
            return {
                ...admin,
                role: 'admin',
                createdAt: admin.createdAt.toISOString(),
                updatedAt: admin.updatedAt.toISOString(),
            };
        }

        // If not admin, get regular user
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (!user) {
            return null;
        }

        return {
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            emailVerified: user.emailVerified?.toISOString() || null,
        };
    } catch (error) {
        return null;
    }
}