"use client";
import Container from "./Container";
import ListingCard from "./listings/ListingCard";
import { SafeListing, SafeUser } from "../types";
import EmptyState from "./EmptyState";
import Categories from "./Navbar/Categories";

interface HomeComponentProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

export default function HomeComponent({ 
  listings,
  currentUser 
}: HomeComponentProps) {
  if (listings.length === 0) {
    return (
      <EmptyState showReset />
    );
  }

  return (
    <Container>
      
      <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing) => (
          <ListingCard
            currentUser={currentUser}
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
    </Container>
  );
}