"use client";
import qs from "query-string"
import useSearchModal from "@/app/hooks/useSearchModal"
import Modal from "@/app/components/Modals/Modal"
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../Inputs/CountrySelect";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calendar from "../Inputs/Calendar";
import Counter from "../Inputs/Counter";


enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const searchModal = () => {
    const router = useRouter();
    const params = useSearchParams()
    const searchModal = useSearchModal()
    const [location, setLocation] = useState<CountrySelectValue>()
    const [step, setStep] = useState(STEPS.LOCATION)
    /*     const [guestCount, setGuestCount] = useState(1) */
    const [roomCount, setRoomCount] = useState(1)
    /*     const [bathroomCount, setBathroomCount] = useState(1) */
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    })

    const Map = useMemo(() => dynamic(() => import('@/app/components/Map'), { ssr: false }), [location])
    const onBack = useCallback(() => {
        setStep((value) => value - 1)
    }, [])
    const onNext = useCallback(() => {
        setStep((value) => value + 1)
    }, [])

    const onSubmit = useCallback(async () => {
        if (step !== STEPS.INFO) {
            return onNext()
        }
        let currentQuery = {}
        if (params) {
            currentQuery = qs.parse(params.toString())
        }
        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,

            roomCount,


        }
        if (dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate)
        }
        if (dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate)
        }

        const url = qs.stringifyUrl({ url: '/', query: updatedQuery }, {

            skipNull: true
        })
        setStep(STEPS.LOCATION)
        searchModal.onClose()
        router.push(url)
    }, [
        step,
        searchModal,
        location,
        router,

        roomCount,
        dateRange,
        onNext,

        params,
    ])
    const actionLabel = useMemo(() => {
        if (step === STEPS.INFO) {
            return 'Search'
        }
        return 'Next'
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined
        }
        return 'Back'
    }
        , [step])


    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading title="Where do you wanna go?" subtitle="Find a Place" />

            <CountrySelect value={location} onChange={(value) =>
                setLocation(value as CountrySelectValue)

            } />
            <hr />
            <Map center={location?.latlng} />
        </div>
    )
    if (step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="When do you plan to go?" subtitle="Select Dates" />
                <Calendar value={dateRange} onChange={(value) => setDateRange(value.selection)} />
            </div>
        )
    }
    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="More information" subtitle="Find your perfect place!" />
                {/*        <Counter
                    onChange={(value) => setGuestCount(value)}
                    value={guestCount}
                    title="Guests"
                    subtitle="How many guests are coming?"
                />
                <hr /> */}
                <Counter
                    onChange={(value) => setRoomCount(value)}
                    value={roomCount}
                    title="Rooms"
                    subtitle="How many rooms do you need?"
                />

                {/*   <hr />
                <Counter
                    onChange={(value) => {
                        setBathroomCount(value);
                    }}
                    value={bathroomCount}
                    title="Bathrooms"
                    subtitle="How many bahtrooms do you need?"
                /> */}
            </div>
        );
    }
    return (
        <Modal
            body={bodyContent}
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Search"
            actionLabel={actionLabel}
        />
    )
}

export default searchModal