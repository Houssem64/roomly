import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
interface IParams {
    userId?: string;
}
export async function DELETE(request: Request,
    { params }: { params: IParams }) {
    try {

        // Extract userId from request params

        const { userId } = params;
        // Delete the user with the provided userId
        if (!userId || typeof userId !== "string") {
            throw new Error("Invalid user ID")
        }
        const deleteUser = await prisma.user.deleteMany({
            where: {
                id: userId,
            },
        });

        // If deletion was successful, return a success response
        return NextResponse.json(deleteUser);
    } catch (error) {

        // Return an error response if deletion fails
        return NextResponse.error();

    }
}