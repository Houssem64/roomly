import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function GET() {
    try {
        const listings = await prisma.listing.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeListings = listings.map(listing => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));

        return NextResponse.json(safeListings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        return NextResponse.json({ message: 'Error fetching listings' }, { status: 500 });
    }
}