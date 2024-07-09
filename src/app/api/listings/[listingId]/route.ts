import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb"

interface IParams {
    listingId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { listingId } = params;
        if (!listingId || typeof listingId !== "string") {
            return NextResponse.json({ error: "Invalid Listing ID" }, { status: 400 });
        }

        const listing = await prisma.listing.deleteMany({
            where: {
                id: listingId,
                userId: currentUser.id
            }
        });

        if (listing.count === 0) {
            return NextResponse.json({ error: "Listing not found or not authorized to delete" }, { status: 404 });
        }

        return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting listing:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}