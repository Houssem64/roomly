'use client';

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";
interface InputProps {
    id: string;
    label: string;
    type?: string;
    disabled?: boolean;
    formatPrice?: boolean;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors
}
const TNDSvg = () => {
    const svg = (
        <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <text x="10" y="30" fontFamily="Arial, Helvetica, sans-serif" fontSize="25" fill="black">TND</text>
        </svg>
    );
    return svg;
};

const Input: React.FC<InputProps> = ({

    id,
    label,
    type = 'text',
    disabled,
    formatPrice,
    required,
    register,
    errors
}) => {
    return (

        <div className="w-full relative">
            {formatPrice && (<label className=" absolute top-5 translate-y-2 left-2 -translate-x-2 " ><TNDSvg /></label>)}
            <input
                id={id}
                type={type}
                disabled={disabled}
                {...register(id, { required })}
                placeholder=" "
                className={` 
                peer
                w-full
                p-4
                pt-6
                font-light
                bg-white
                border-2
                rounded-md
                outline-none
                transition
                disabled:opacity-70
                disabled:cursor-not-allowed
                ${formatPrice ? 'pl-9' : 'pl-4'}
                ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
                ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}
                `}
            />
            <label
                className={`
            absolute 
            text-sm
            duration-150
            transform
            -translate-y-3
            top-5
            z-10
            origin-[0]
            ${formatPrice ? 'left-9' : 'left-4'}
            peer-placeholder-shown:scale-100
            peer-placeholder-shaown:translate-y-0
            peer-focus:scale-75
            peer-focus:-translate-y-4 
            ${errors[id] ? 'text-rose-500' : 'text-zinc-400'}
            `}
            >
                {label}
            </label>
        </div>);
}

export default Input;