// app/actions/getListings.ts

import prisma from '@/app/libs/prismadb'

export interface Listing {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    createdAt: string;
    category: string;
    roomCount: number;
    bathroomCount: number;
    guestCount: number;
    locationValue: string;
    userId: string;
    price: number;
}

export interface IListingsParams {
    userId?: string;
    category?: string;
    createdAfter?: string;
    createdBefore?: string;
}

export default async function getListings(params: IListingsParams = {}): Promise<Listing[]> {
    try {
        const { userId, category, createdAfter, createdBefore } = params;
        let query: any = {};

        if (userId) {
            query.userId = userId;
        }

        if (category) {
            query.category = category;
        }

        if (createdAfter || createdBefore) {
            query.createdAt = {};
            if (createdAfter) {
                query.createdAt.gte = new Date(createdAfter);
            }
            if (createdBefore) {
                query.createdAt.lte = new Date(createdBefore);
            }
        }

        const listings = await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return listings.map((listing) => ({
            id: listing.id,
            title: listing.title,
            description: listing.description,
            imageSrc: listing.imageSrc,
            createdAt: listing.createdAt.toISOString(),
            category: listing.category,
            roomCount: listing.roomCount,
            bathroomCount: listing.bathroomCount,
            guestCount: listing.guestCount,
            locationValue: listing.locationValue,
            userId: listing.userId,
            price: listing.price
        }));
    } catch (error: any) {
        console.error("Error fetching listings:", error);
        throw new Error("Something went wrong while fetching listings");
    }
}