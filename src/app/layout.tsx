import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar/NavBar';
import RegisterModal from './components/Modals/RegisterModal';
import LoginModal from './components/Modals/LoginModal';
import RentModal from './components/Modals/RentModal';
import SearchModal from './components/Modals/SearchModal';

import './globals.css';
import getCurrentUser from './actions/getCurrentUser';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingState from './loading';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Roomly',
  description: 'Property rental platform',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Toaster />
          <RegisterModal />
          <LoginModal />
          <RentModal />
          <SearchModal />
          <Navbar currentUser={currentUser} />
          <div className="pb-20 pt-28">
            <Suspense fallback={<LoadingState />}>
              {children}
            </Suspense>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}