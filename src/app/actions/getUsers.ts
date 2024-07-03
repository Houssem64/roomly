// app/actions/getUsers.ts

import prisma from '@/app/libs/prismadb'

export interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;

    createdAt: string;
}

export interface IUsersParams {

    createdAfter?: string;
    createdBefore?: string;
}

export default async function getUsers(params: IUsersParams = {}): Promise<User[]> {
    try {
        const { createdAfter, createdBefore } = params;
        let query: any = {};



        if (createdAfter || createdBefore) {
            query.createdAt = {};
            if (createdAfter) {
                query.createdAt.gte = new Date(createdAfter);
            }
            if (createdBefore) {
                query.createdAt.lte = new Date(createdBefore);
            }
        }

        const users = await prisma.user.findMany({
            where: query,
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

        return users.map((user) => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
        }));
    } catch (error: any) {
        throw new Error("Something went wrong while fetching users");
    }
}