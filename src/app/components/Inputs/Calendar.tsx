"use client";

import { DateRange, Range, RangeKeyDict } from "react-date-range";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

interface CalendarProps {
    value: Range;
    onChange: (value: RangeKeyDict) => void;
    disabledDates?: Date[];
}

const Calendar: React.FC<CalendarProps> = ({
    value,
    onChange,
    disabledDates
}) => {
    return (
        <DateRange
            rangeColors={['#262626']}
            ranges={[value]}
            onChange={onChange}
            date={new Date()}
            direction="vertical"
            disabledDates={disabledDates}
            minDate={new Date()}


        />);
}

export default Calendar;