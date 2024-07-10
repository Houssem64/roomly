"use client";

import { SafeUser } from "@/app/types";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import ListingCategory from "@/app/components/listings/ListingCategory";
import dynamic from "next/dynamic";


const Map = dynamic(() => import("../Map"), { ssr: false });


interface ListingInfoProps {
    user: SafeUser;
    category: {
        icon: IconType;
        label: string;
        description: string;
    } | undefined;
    description: string;
    roomCount: number;
    guestCount: number;
    bathroomCount: number;
    locationValue: string;
    phoneNumber: string;
}
const tunisiaRegions = [
    { region: "Ariana", latitude: 36.8663, longitude: 10.1644 },
    { region: "Beja", latitude: 36.7295, longitude: 9.1895 },
    { region: "Ben Arous", latitude: 36.7477, longitude: 10.229 },
    { region: "Bizerte", latitude: 37.2744, longitude: 9.8736 },
    { region: "Gabes", latitude: 33.8886, longitude: 10.0982 },
    { region: "Gafsa", latitude: 34.425, longitude: 8.7842 },
    { region: "Jendouba", latitude: 36.5013, longitude: 8.7809 },
    { region: "Kairouan", latitude: 35.6804, longitude: 10.0982 },
    { region: "Kasserine", latitude: 35.1676, longitude: 8.8365 },
    { region: "Kebili", latitude: 33.7068, longitude: 8.9692 },
    { region: "Kef", latitude: 36.1746, longitude: 8.7042 },
    { region: "Mahdia", latitude: 35.5016, longitude: 11.0622 },
    { region: "Manouba", latitude: 36.8121, longitude: 10.0761 },
    { region: "Medenine", latitude: 33.3542, longitude: 10.512 },
    { region: "Monastir", latitude: 35.6892, longitude: 10.9027 },
    { region: "Nabeul", latitude: 36.4561, longitude: 10.7376 },
    { region: "Sfax", latitude: 34.7489, longitude: 10.7613 },
    { region: "Sidi Bouzid", latitude: 35.0342, longitude: 9.4855 },
    { region: "Siliana", latitude: 36.0907, longitude: 9.3692 },
    { region: "Sousse", latitude: 35.8288, longitude: 10.6407 },
    { region: "Tataouine", latitude: 32.9265, longitude: 10.4515 },
    { region: "Tozeur", latitude: 33.9193, longitude: 8.1339 },
    { region: "Tunis", latitude: 36.8065, longitude: 10.1815 },
    { region: "Zaghouan", latitude: 36.3999, longitude: 10.1479 }
];



const ListingInfo: React.FC<ListingInfoProps> = ({
    user,
    category,
    description,
    roomCount,
    guestCount,
    bathroomCount,
    locationValue, phoneNumber
}) => {
    const location = locationValue
    const region = tunisiaRegions.find((region) => region.region === location);

    let coordinates;
    if (region) {
        coordinates = [region.latitude, region.longitude];
    }


    return (
        <div className="col-span-4 flex flex-col gap-8 ">

            <div className="flex flex-col gap-2">
                <div className="
                    text-xl font-semibold flex flex-row items-center gap-2
                ">
                    <div>Hosted by {user?.name} </div>
                    <Avatar src={user?.image} />
                </div>
                <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
                    <div>
                        {guestCount} Guests
                    </div>
                    <div>
                        {bathroomCount} Bathrooms
                    </div>
                    <div>
                        {roomCount} Rooms
                    </div>
                </div>
            </div>
            <hr />
            {category && (
                <ListingCategory icon={category.icon} label={category.label} description={category.description} />

            )}
            <hr />
            <div className="text-lg font-light text-neutral-500">
                {description}

            </div>
            <hr />
            <div className=" font-medium"> Contact Owner: <span className="font-extrabold"> {phoneNumber}</span></div>
            <hr />
            <Map center={coordinates} />
        </div>);
}

export default ListingInfo;