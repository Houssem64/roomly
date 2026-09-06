import { Listing, User,Reservation } from "@prisma/client";

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export interface ErrorResponse {
  error: string;
  status?: number;
}

export interface SuccessResponse<T> {
  data: T;
  message?: string;
}

// Add any additional shared interfaces
export interface ListingParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
  price?: number;
}
export interface IListingsParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
    price?: number;
  }
/** Coordonnées du locataire, affichées au propriétaire du bien. */
export interface ReservationGuest {
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  image: string | null;
}

// Add this to your existing types file
export type SafeReservation = Omit<
  Reservation,
  "createdAt" | "startDate" | "endDate" | "listing" | "paymentExpiresAt"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  paymentExpiresAt?: string | null;
  listing: SafeListing;
  guest?: ReservationGuest;
};
export interface ReservationParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}