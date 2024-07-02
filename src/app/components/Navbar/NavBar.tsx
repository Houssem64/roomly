"use client";
import React from 'react'
import { usePathname } from 'next/navigation';
import Container from '@/app/components/Container'
import Logo from '@/app/components/Navbar/Logo'
import Search from '@/app/components/Navbar/Search'
import UserMenu from '@/app/components/Navbar/UserMenu'
import { SafeUser } from '@/app/types';
import Categories from './Categories';


interface NavbarProps {
    currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
    const params = usePathname();
    if (params === '/admin') return null;
    return (
        <div className="fixed w-full bg-white z-10 shadow-sm">
            <div className='py-4 border-b-[1px]  '>
                <Container>
                    <div className='
                    flex 
                    flex-row 
                    items-center
                    justify-between
                    gap-3
                    md-gap-0
                    '> <Logo />
                        <Search />
                        <UserMenu currentUser={currentUser} />

                    </div>
                </Container>

            </div>
            <Categories />
        </div>
    )
}
export default Navbar;



