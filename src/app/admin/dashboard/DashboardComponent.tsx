"use client";

import Link from "next/link";
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuLabel, 
    DropdownMenuCheckboxItem 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaBan } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/app/components/Loader";

// Move interfaces to a separate types file
interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string | null;
    createdAt: string;
}

interface Listing {
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

function DashboardComponent() {
    const [users, setUsers] = useState<User[]>([]);
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [usersResponse, listingsResponse] = await Promise.all([
                    fetch('/api/users'),
                    fetch('/api/alllistings')
                ]);

                if (!usersResponse.ok || !listingsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [usersData, listingsData] = await Promise.all([
                    usersResponse.json(),
                    listingsResponse.json()
                ]);

                setUsers(usersData);
                setListings(listingsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                toast.error('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const deleteUser = async (userId: string) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers(users.filter(user => user.id !== userId));
            toast.success('User deleted successfully');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error deleting user');
        }
    };

    const deleteListing = async (listingId: string) => {
        try {
            const response = await fetch(`/api/listings/${listingId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete listing');
            }

            setListings(listings.filter(listing => listing.id !== listingId));
            toast.success(data.message || 'Listing deleted successfully');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error deleting listing');
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">Error</h2>
                    <p className="mt-2">{error}</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col -translate-y-24">
            {/* Header Section */}
            <header className="bg-background border-b flex items-center justify-between px-4 sm:px-6 h-16">
                <Link href="/" prefetch={false}>
                    <Image 
                        src="/images/logo.png" 
                        alt="Logo" 
                        width={200} 
                        height={200} 
                        className="mx-auto" 
                    />
                </Link>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Avatar className="w-8 h-8 border">
                                    <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 bg-muted/40 p-4 sm:p-6">
                {/* Users Section */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage user accounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="w-8 h-8 border">
                                                    <AvatarImage 
                                                        src={user.image || "/placeholder-user.jpg"} 
                                                        alt={user.name || 'User'} 
                                                    />
                                                    <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                                                </Avatar>
                                                <span>{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteUser(user.id)}
                                                className="text-red-500"
                                            >
                                                <FaBan />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Listings Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Listings</CardTitle>
                        <CardDescription>Manage property listings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Property</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listings.map(listing => (
                                    <TableRow key={listing.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Image 
                                                    src={listing.imageSrc} 
                                                    width={64} 
                                                    height={64} 
                                                    alt={listing.title}
                                                    className="rounded-md object-cover"
                                                />
                                                <div>
                                                    <div className="font-medium">{listing.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {listing.description.substring(0, 50)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{listing.locationValue}</TableCell>
                                        <TableCell>${listing.price}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteListing(listing.id)}
                                                className="text-red-500"
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

export default DashboardComponent;