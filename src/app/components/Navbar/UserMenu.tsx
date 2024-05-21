"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "@/app/components/Avatar";
import { useCallback, useState } from "react";
import MenuItem from "@/app/components/Navbar/MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";

interface UserMenuProps {
    currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
    const registerModal = useRegisterModal();
    const LoginModal = useLoginModal();
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const toggleMenu = useCallback(() => {
        setIsMenuOpen((value) => !value)
    }, [])
    return (<div className="relative">
        <div className="flex flex-row items-center gap-3">
            <div
                className="hidden md:block text-sm font-semibold px-4 py-3 rounded-full hover:bg-netral-100 transition cursor-pointer"
                onClick={() => { }}
            > Rent your Home</div>
            <div onClick={toggleMenu} className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-700 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                <AiOutlineMenu />
                <div className="hidden md:block">
                    <Avatar src={currentUser?.image} />

                </div>
            </div>
        </div>


        {isMenuOpen && (<div className="absolute rounded-xl shadow-m w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm  ">
            <div className="flex flex-col cursor-pointer">
                {currentUser ? (<>
                    <MenuItem onClick={() => { }}
                        label="List a Property"
                    />
                    <MenuItem onClick={() => { }}
                        label="Reservations"
                    />
                    <MenuItem onClick={() => { }}
                        label="My Properties"
                    />
                    <MenuItem onClick={() => { }}
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