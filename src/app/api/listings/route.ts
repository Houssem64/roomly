import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

import getCurrentUser from "@/app/actions/getCurrentUser";


export async function POST(
    request: Request
) {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return NextResponse.error()
    }
    const body = await request.json()
    const { title, description, price, imageSrc, roomCount, location, guestCount, bathroomCount, category } = body


    const listing = await prisma.listing.create({
        data: {
            title,
            description,
            price: parseInt(price, 10),
            imageSrc,
            roomCount,
            locationValue: location.value,
            guestCount,
            bathroomCount,
            category,
            userId: currentUser.id,
            phoneNumber: currentUser?.phoneNumber
        }
    })
    return NextResponse.json(listing)

}