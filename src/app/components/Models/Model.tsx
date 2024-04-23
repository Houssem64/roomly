'use client';
import React, { useState, useEffect, useCallback  } from'react';


interface ModelProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSubmit?: () => void;
    title?: string;
    body ?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel ?: string;
    disabled?: boolean;
    seconderyAction?: () => void;
    seconderyActionLabel?: string;

}
const model : React.FC<ModelProps> = ({
    
    isOpen, 
    onClose,
    onSubmit, 
    title,
    body, 
    footer,
    actionLabel, 
    disabled, 
    seconderyAction,
    seconderyActionLabel

}) => {
   
    const [ showModel , setShowModel ] = useState(isOpen); 
    useEffect (() => {
        setShowModel(isOpen);
    }, [isOpen]);
    
    const handleClose =useCallback (() => {
        if (disabled){ 
            
            return;

        }
        setShowModel(false);
        setTimeout (() => {
            onClose && onClose();
        }, 300);
    }, [disabled, onClose]);

    const habdleSubmit = useCallback (() => {
        if (disabled){

            return;

            
        }
        onSubmit && onSubmit();
    }, [disabled, onSubmit]);

    const handleSeconderyAction =useCallback (() => {
        if (disabled ||!seconderyAction){
            return;
        }
        seconderyAction();
    }, [disabled, seconderyAction]);

    if (!isOpen){
        return null;
    }


    
    return (

        <>
         <div 
         className="
            justify-center
            items-center
            flex
            overflow-x-hidden
            overflow-y-auto
            fixed
            inset-0
            z-50
            outline-none
            focus:outline-none
            bg-neutral-800/70  
        ">

        <div 
            className="
            relative
            w-full
            md:w-4/6
            lg:w-3/6
            xl:w-2/5
            my-6
            mx-auto
            h-full
            lg:h-auto
            md:h-auto
        ">
        <div
            className={`
            translate
            transition-300
            h-full
            ${showModel ? 'translate-y-0' : 'translate-y-full'}
            ${showModel ? 'opacity-100' : 'opacity-0'}

            
            `}
        >

        </div>
        </div>
        </div>
        </>

    );
}
export default model;