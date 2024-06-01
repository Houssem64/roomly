

import { Listing } from "@prisma/client";
import { Range } from "react-date-range";
import TNDSvg from "../TNDSvg";
import Calendar from "../Inputs/Calendar";
import Button from "../Button";

interface ListingReservationProps {
    category: string;
    price: number;
    dateRange: Range
    totalPrice: number;
    onChangeDate: (value: Range) => void;
    onSubmit: () => void;
    disabledDates: Date[];
    disabled?: boolean;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
    category,
    price,
    dateRange,
    totalPrice,
    onChangeDate,
    onSubmit,
    disabled,
    disabledDates,
}) => {
    console.log(category);
    return (
        <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden ">
            <div className="flex flex-row items-center gap-1 p-4 ">
                <div>
                    <div className="text-2xl font-semibold">
                        {price} TND
                    </div>


                    {category && (
                        <div className="font-light next-neutral-600 ">
                            {(category === "Villa" || category === "Vacation") ? "per Night" : "per Month"}
                        </div>
                    )}

                </div>


            </div>
            <hr />
            <Calendar value={dateRange} disabledDates={disabledDates} onChange={(value) => onChangeDate(value.selection)} />
            <hr />
            {category === "Villa" || category === "Vacation" ? <div className="
        p-4
        flex flex-row
        justify-between
        items-center
        font-semibold
        text-lg
        ">Total Price:
                <div className="	">{totalPrice} TND</div>  </div> : null}
            <hr />
            <div className="p-4">
                <Button
                    onClick={onSubmit}
                    disabled={disabled}
                    label="Reserve"

                />
            </div>




        </div>);
}

export default ListingReservation;