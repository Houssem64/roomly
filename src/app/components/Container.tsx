"use client";
import React from 'react'
import { Suspense } from 'react';
import Loading from '../loading';
interface ContainerProps {
    children: React.ReactNode;

}
const Container: React.FC<ContainerProps> = ({ children }) => {
    return (
        <Suspense fallback={<Loading />}>
            <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 ">
                {children}
            </div>
        </Suspense>
    )
}
export default Container;


