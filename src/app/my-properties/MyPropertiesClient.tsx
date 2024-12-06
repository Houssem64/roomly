"use client";

import { useCallback, useState } from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { SafeListing, SafeUser } from "../types";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

interface MyPropertiesClientProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const MyPropertiesClient: React.FC<MyPropertiesClientProps> = ({
  listings,
  currentUser
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onDelete = useCallback(async (id: string) => {
    try {
      setDeletingId(id);
      
      const response = await axios.delete(`/api/listings/${id}`);
      
      if (response.status === 200) {
        toast.success('Property deleted successfully');
        router.refresh();
      } else {
        throw new Error(response.data?.error || 'Failed to delete property');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error deleting property');
    } finally {
      setDeletingId('');
    }
  }, [router]);

  const onEdit = useCallback((id: string) => {
    router.push(`/listings/${id}/edit`);
  }, [router]);

  return (
    <Container>
      <Heading
        title="My Properties"
        subtitle="Manage your properties"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onDelete}
            disabled={deletingId === listing.id}
            actionLabel="Delete property"
            currentUser={currentUser}
            onSecondaryAction={() => onEdit(listing.id)}
            secondaryActionLabel="Edit property"
          />
        ))}
      </div>
    </Container>
  );
};

export default MyPropertiesClient;