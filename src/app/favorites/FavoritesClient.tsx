"use client";

import { SafeListing, SafeUser } from "../types";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

interface FavoritesClientProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  listings,
  currentUser
}) => {
  const [deletingId, setDeletingId] = useState('');

  const onUnfavorite = useCallback(async (listingId: string) => {
    try {
      setDeletingId(listingId);
      const response = await fetch(`/api/favorites/${listingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to unfavorite property');
      }

      toast.success('Property removed from favorites');
      // You might want to refresh the page or update the listings state here
    } catch (error) {
      toast.error('Error removing property from favorites');
    } finally {
      setDeletingId('');
    }
  }, []);

  return (
    <Container>
      <Heading
        title="Favorites"
        subtitle="List of properties you have favorited"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            currentUser={currentUser}
            onAction={onUnfavorite}
            disabled={deletingId === listing.id}
            actionLabel="Remove from favorites"
            actionId={listing.id}
          />
        ))}
      </div>
    </Container>
  );
};

export default FavoritesClient;