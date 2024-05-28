"use client";
import Container from "../Container";
import { PiStudent } from "react-icons/pi";
import { PiOfficeChair } from "react-icons/pi";
import { FaStore } from "react-icons/fa";

import { PiBuildingApartment } from "react-icons/pi";
import CategoryBox from "../CategoryBox";
import { TbBeach } from "react-icons/tb";
import { usePathname, useSearchParams } from "next/navigation";
import { LiaWarehouseSolid } from "react-icons/lia";
import { GiFamilyHouse } from "react-icons/gi";






export const categories = [{
    label: 'Student housing',
    icon: PiStudent,
    description: 'Find your perfect student home',

},
{
    label: 'Vacation',
    icon: TbBeach,
    description: 'Vacation property ',

},
{
    label: 'Apartment',
    icon: PiBuildingApartment,
    description: 'Apartment for rent',

}, {
    label: 'Office',
    icon: PiOfficeChair,
    description: 'Office for rent',

},
{
    label: 'Commercial',
    icon: FaStore,
    description: 'Commercial property for rent',

},
{
    label: 'Self-storage',
    icon: LiaWarehouseSolid,
    description: 'Self-storage for rent',

}
    ,
{
    label: 'Villa',
    icon: GiFamilyHouse,
    description: 'villa for rent',

}
]
const Categories = () => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();
    const isMainPage = pathname === '/';
    if (!isMainPage) {
        return null;
    }
    return (<Container>
        <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto" >
            {categories.map((item) => (
                <CategoryBox
                    key={item.label}
                    label={item.label}
                    selected={category === item.label}
                    icon={item.icon}
                />))}
        </div>
    </Container>);
}

export default Categories;