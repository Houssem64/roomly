"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { FiBarChart2, FiUsers, FiHome, FiLogOut, FiExternalLink } from "react-icons/fi";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import StatsPanel from "./StatsPanel";
import UsersPanel from "./UsersPanel";
import ListingsPanel from "./ListingsPanel";

type Tab = "overview" | "users" | "listings";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Vue d'ensemble", icon: FiBarChart2 },
    { id: "users", label: "Utilisateurs", icon: FiUsers },
    { id: "listings", label: "Biens", icon: FiHome },
];

interface DashboardComponentProps {
    adminEmail: string;
}

export default function DashboardComponent({ adminEmail }: DashboardComponentProps) {
    const [tab, setTab] = useState<Tab>("overview");

    return (
        <div className="min-h-screen bg-muted/40">
            {/* ---- En-tête ---- */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
                <div className="flex items-center gap-4">
                    <Link href="/" prefetch={false} className="shrink-0">
                        <Image
                            src="/images/logo.png"
                            alt="Roomly"
                            width={120}
                            height={40}
                            className="h-9 w-auto object-contain"
                            priority
                        />
                    </Link>
                    <span className="hidden sm:inline rounded-full bg-[#E2A399]/15 px-3 py-1 text-xs font-semibold text-[#C67F72]">
                        Administration
                    </span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Avatar className="h-8 w-8 border">
                                <AvatarFallback>
                                    {adminEmail.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuLabel className="font-normal">
                            <div className="text-xs text-muted-foreground">Connecté en tant que</div>
                            <div className="truncate font-medium">{adminEmail}</div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/" prefetch={false} className="cursor-pointer">
                                <FiExternalLink className="mr-2" size={14} />
                                Voir le site
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => signOut({ callbackUrl: "/admin" })}
                        >
                            <FiLogOut className="mr-2" size={14} />
                            Se déconnecter
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <div className="flex flex-col lg:flex-row">
                {/* ---- Navigation ---- */}
                <nav className="border-b bg-background lg:min-h-[calc(100vh-4rem)] lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
                    <ul className="flex overflow-x-auto p-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:p-4">
                        {TABS.map(({ id, label, icon: Icon }) => (
                            <li key={id} className="shrink-0 lg:w-full">
                                <button
                                    type="button"
                                    onClick={() => setTab(id)}
                                    aria-current={tab === id ? "page" : undefined}
                                    className={`flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                        tab === id
                                            ? "bg-[#E2A399]/15 text-[#C67F72]"
                                            : "text-muted-foreground hover:bg-muted"
                                    }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* ---- Contenu ---- */}
                <main className="min-w-0 flex-1 p-4 sm:p-6">
                    {tab === "overview" && <StatsPanel />}
                    {tab === "users" && <UsersPanel />}
                    {tab === "listings" && <ListingsPanel />}
                </main>
            </div>
        </div>
    );
}
