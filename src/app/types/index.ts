import { User, Listing, Reservation } from "@prisma/client";

export type SafeUser = Omit<User, "createdAt" | "updatedAt" | "emailVerified"> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
};

export type SafeListing = Omit<Listing, "createdAt"> & {
    createdAt: string;
    phoneNumber: string | null;
};
export type SafeReservation = Omit<Reservation, "createdAt" | "startDate" | "endDate"> & {
    createdAt: string;
    startDate: string;
    endDate: string;
    listing: SafeListing;
    phoneNumber: string | null;
};

