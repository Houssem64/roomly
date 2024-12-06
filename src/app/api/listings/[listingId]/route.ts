import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { ErrorResponse, SuccessResponse } from "@/app/types";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
): Promise<NextResponse<SuccessResponse<null> | ErrorResponse>> {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json(
        { error: "Invalid listing ID" },
        { status: 400 }
      );
    }

    // First check if the listing exists and belongs to the user
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (listing.userId !== currentUser.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this listing" },
        { status: 403 }
      );
    }

    // Delete the listing
    await prisma.listing.delete({
      where: {
        id: listingId,
      },
    });

    return NextResponse.json(
      { 
        data: null,
        message: "Listing deleted successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}