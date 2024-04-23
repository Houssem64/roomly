import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/components/Navbar/NavBar";
import Model from "@/app/components/Models/Model";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roomly",
  description: "Property rental made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <Model />
        {children}</body>
    </html>
  );
}
