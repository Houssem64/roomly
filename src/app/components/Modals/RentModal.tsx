"use client";
import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../Navbar/Categories";
import CategoryInput from "../Inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../Inputs/CountrySelect";
import Map from "../Map";
import dynamic from "next/dynamic";
import Counter from "../Inputs/Counter";
import ImageUpload from "../Inputs/ImageUpload";
import Input from "../Inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGE = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}



const RentModal = () => {
    const RentModal = useRentModal();
    const router = useRouter()
    const [step, setStep] = useState(STEPS.CATEGORY)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: "",
            locationValue: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: "",
            price: 0,
            title: "",
            description: "",


        }
    });
    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, { shouldDirty: true, shouldValidate: true, shouldTouch: true })
    }
    const category = watch("category")
    const location = watch("location")
    const guestCount = watch("guestCount")
    const roomCount = watch("roomCount")
    const bathroomCount = watch("bathroomCount")
    const imageSrc = watch("imageSrc")


    const Map = useMemo(() => dynamic(() => import('../Map'), { ssr: false }), [location]);

    const onBack = () => {
        setStep((prev) => prev - 1)
    }
    const onNext = () => {
        setStep((prev) => prev + 1)
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            return onNext()

        }
        setIsLoading(true)
        axios.post("/api/listings", data)
            .then(() => {
                toast.success("Listing created successfully")
                router.refresh()
                reset()
                setStep(STEPS.CATEGORY)
                RentModal.onClose()
            })
            .catch(() => {
                toast.error("An error occured")
            })
            .finally(() => {
                setIsLoading(false)
            })
    }



    const actionlabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return "Create"
        }
        return "Next"
    }, [step])
    const seconderyAction = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined
        }
        return "Back"
    }, [step])
    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Describe your property"
                subtitle="Pick a category that best describes your property"


            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto" >
                {categories.map((item) => (<div key={item.label} className="col-span-1">
                    <CategoryInput onClick={(category) => { setCustomValue('category', category) }}

                        selected={category === item.label} label={item.label} icon={item.icon} />
                </div>))}
            </div>
        </div>
    )
    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8" >
                <Heading title="Where is your place located" subtitle="Help guests find you !" />
                <CountrySelect value={location} onChange={(value) => setCustomValue('location', value)} />

                <Map

                    center={location?.latlng} />

            </div>)
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Tell us about your property" subtitle="general information about the property" >

                </Heading>
                <Counter
                    title="Guests"
                    subtitle="How many guests can you accommodate"
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}

                />
                <hr />
                <Counter
                    title="Rooms"
                    subtitle="How many rooms"
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}

                />
                {/*                 <hr />
                <Counter
                    title="Floors"
                    subtitle="How many floors"
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}

                /> */}
                <hr />
                <Counter
                    title="Bathrooms"
                    subtitle="How many Bathrooms"
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}

                />
            </div>
        )
    }

    if (step === STEPS.IMAGE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Add a photo" subtitle="Showcase your property" />
                <ImageUpload value={imageSrc} onChange={(value) => setCustomValue('imageSrc', value)} />
            </div>
        )
    }
    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Describe your place" subtitle="short description" />
                <Input id="title" label="Title" disabled={isLoading} register={register} errors={errors} required />
                <hr />
                <Input type="textarea" id="description" label="Description" disabled={isLoading} register={register} errors={errors} required />

            </div>
        )
    }
    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Set your price" subtitle="how much do you charge per night" />
                <Input id="price" label="Price" formatPrice disabled={isLoading} register={register} errors={errors} required />

            </div>

        )
    }
    return (
        <div>
            <Modal
                isOpen={RentModal.isOpen}
                onClose={RentModal.onClose}
                onSubmit={handleSubmit(onSubmit)}
                actionLabel={actionlabel}
                seconderyActionLabel={seconderyAction}
                seconderyAction={step === STEPS.CATEGORY ? undefined : onBack}
                title="Rent your Home"
                body={bodyContent}
            />
        </div>
    );
}
export default RentModal;