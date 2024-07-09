"use client";
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { FaBan } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Image from "next/image";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";


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

export default function Component() {
    const [users, setUsers] = useState<User[]>([]);
    const [listings, setListings] = useState<Listing[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await fetch('/api/users');
                const usersData = await usersResponse.json();
                setUsers(usersData);

                const listingsResponse = await fetch('/api/alllistings');
                const listingsData = await listingsResponse.json();
                setListings(listingsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    const deleteUser = async (userId: string) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });
            if (response.ok) {

                setUsers(users.filter(user => user.id !== userId));

            } else {

                console.error('Failed to delete user');
            }
        } catch (error) {

            console.error('Error deleting user:', error);
        } finally {
            toast.success('User deleted successfully');
        }
    };

    const deleteListing = async (listingId: string) => {
        try {
            const response = await fetch(`/api/listings/${listingId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                // Remove the listing from the local state
                setListings(listings.filter(listing => listing.id !== listingId));

                // Show success message
                toast.success(data.message || 'Listing deleted successfully');
            } else {
                throw new Error(data.error || 'Failed to delete listing');
            }
        } catch (error) {
            // Show error message
            toast.error(error instanceof Error ? error.message : 'Error deleting listing');
            console.error('Error deleting listing:', error);
        }
    };
    return (
        <div className="flex flex-col -translate-y-24 ">
            <Toaster />
            <header className="bg-background border-b flex items-center justify-between px-4 sm:px-6 h-16">
                <Link href="#" className="flex items-center gap-2" prefetch={false}>
                    <Image src="/images/logo.png" alt="Logo" width={200} height={200} className="justify-center items-center mx-auto" />

                </Link>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Avatar className="w-8 h-8 border">
                                    <AvatarImage src="/placeholder-user.jpg" />
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
            <main className="flex-1 bg-muted/40 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <div className="flex items-center gap-2">

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1">
                                    <FilterIcon className="w-4 h-4" />
                                    Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem>Active users</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Banned users</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Active listings</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Deleted listings</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <Card>
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
                                    <TableHead>Ban</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="w-8 h-8 border">
                                                    <AvatarImage src={user.image || "/placeholder-user.jpg"} />
                                                    <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="mx-auto" onClick={() => deleteUser(user.id)}>
                                                <FaBan />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Listings</CardTitle>
                        <CardDescription>Manage property listings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Delete</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listings.map(listing => (
                                    <TableRow key={listing.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Image src={listing.imageSrc} width={64} height={64} alt="Listing" className="rounded-md" />
                                                <div>
                                                    <div className="font-medium">{listing.title}</div>
                                                    <div className="text-sm text-muted-foreground">{listing.description}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{listing.locationValue}</TableCell>
                                        <TableCell>${listing.price}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoveVerticalIcon className="w-4 h-4" />
                                                        <span className="sr-only">Listing actions</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Listing</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => deleteListing(listing.id)}>Delete Listing</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    )
}




function MoveVerticalIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="8 18 12 22 16 18" />
            <polyline points="8 6 12 2 16 6" />
            <line x1="12" x2="12" y1="2" y2="22" />
        </svg>
    )
}