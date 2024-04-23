import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/components/Navbar/NavBar";
import RegisterModal from "./components/Modals/RegisterModal";
import ToasterProvider from "./providers/ToasterProvider";
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
        <ToasterProvider />
        <RegisterModal />
        <NavBar />
        {children}</body>
    </html>
  );
}
