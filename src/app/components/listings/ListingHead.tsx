"use client";

import { SafeUser } from "@/app/types";
import Heading from "../Heading";
import Image from "next/image";
import HeartButton from "./HeartButton";

interface ListingHeadProps {
    title: string;
    locationValue: string;
    imageSrc: string;
    id: string;
    currentUser?: SafeUser | null;
}


const ListingHead: React.FC<ListingHeadProps> = ({
    title,
    locationValue,
    imageSrc,
    id,
    currentUser,
}) => {
    const location = locationValue
    return (
        <>
            <Heading
                title={title}
                subtitle={location}
            />
            <div className="w-full h-[60vh] overflow-hidden rounded-xl relative ">
                <Image
                    alt="Image"
                    src={imageSrc}
                    fill
                    className="object-cover w-full   "
                    quality={100}
                    loading='lazy'


                />

                <div className="absolute top-5 right-5">
                    <HeartButton listingId={id} currentUser={currentUser} />
                </div>
            </div>
        </>
    );
}

export default ListingHead;