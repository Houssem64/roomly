import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/components/Navbar/NavBar";
import RegisterModal from "./components/Modals/RegisterModal";
import LoginModal from "./components/Modals/LoginModal";
import ToasterProvider from "./providers/ToasterProvider";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/Modals/RentModal";
import SearchModal from "./components/Modals/SearchModal";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roomly",
  description: "Property rental made easy",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider />
        <RegisterModal />
        <SearchModal />
        <LoginModal />
        <RentModal />
        <NavBar currentUser={currentUser} />
        <div className="pb-20 pt-28">

          {children}</div></body>
    </html>
  );
}
