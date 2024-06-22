"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "@/app/components/Avatar";
import { use, useCallback, useState } from "react";
import MenuItem from "@/app/components/Navbar/MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";
import useRentModal from "@/app/hooks/useRentModal";
import { useRouter } from "next/navigation";

interface UserMenuProps {
    currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
    const router = useRouter();
    const registerModal = useRegisterModal();
    const LoginModal = useLoginModal();
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const rentModal = useRentModal();
    const toggleMenu = useCallback(() => {
        setIsMenuOpen((value) => !value)
    }, [])
    const onRent = useCallback(() => {
        if (!currentUser) {
            return LoginModal.onOpen()

        }
        rentModal.onOpen()
    }, [currentUser, LoginModal, rentModal])


    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    className="hidden md:block text-sm font-semibold px-4 py-3 rounded-full hover:bg-netral-100 transition cursor-pointer"
                    onClick={onRent}
                > Rent your Home</div>
                <div onClick={toggleMenu} className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-700 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Avatar src={currentUser?.image} />

                    </div>
                </div>
            </div>


            {isMenuOpen && (<div className="absolute rounded-xl shadow-sm shadow-black w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm  ">
                <div className="flex flex-col cursor-pointer ">
                    {currentUser ? (<>
                        <MenuItem onClick={rentModal.onOpen}
                            label="List a Property"

                        />
                        <MenuItem onClick={() => router.push("/my-reservations")}
                            label="My Reservations"
                        />
                        <MenuItem onClick={() => router.push("/my-properties")}
                            label="My Properties"
                        />
                        <MenuItem onClick={() => router.push("/property-reservations")}
                            label="Your Property's Reservations"
                        />
                        <MenuItem onClick={() => router.push("/favorites")}
                            label="Favorites"
                        />


                        <hr />
                        <MenuItem onClick={() => signOut()}
                            label="Logout"
                        />

                    </>) : (
                        <>
                            <MenuItem onClick={LoginModal.onOpen}
                                label="Login"
                            />
                            <MenuItem onClick={registerModal.onOpen}
                                label="Sign Up"
                            />
                        </>
                    )}

                </div>
            </div>)}
        </div>);
}

export default UserMenu;