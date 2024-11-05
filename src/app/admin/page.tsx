"use client";
import Image from "next/image"
import Link from "next/link"
import Button from "../components/Button";
import { Suspense, useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/Loader"; // A fallback component




function Component() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {

            email: '',
            password: '',
        },
    });


    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        try {
            await signIn("credentials", {
                ...data,
                redirect: false,
            });
            router.push("/dashboard");
        } catch (error) {
            toast.error("Error signing in");
            console.error("Error signing in:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const signinfake = () => {
        router.push("/admin/dashboard")
        toast.success("signed in successfuly")
    }
    return (
        <div className="flex  items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <Link href="#" prefetch={false}>
                        <Image src="/images/logo.png" alt="Logo" width={200} height={200} className="justify-center items-center mx-auto" />
                        <h2 className="mt-6 text-center text-3xl text-[#E2A399] font-bold tracking-tight ">Admin Portal</h2>
                    </Link>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-bold text-[#E2A399]">
                            Username:
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            className="relative block w-full appearance-none rounded-md border border-muted px-3 py-2 text-black placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-bold text-[#E2A399]">
                            Password:
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="relative block w-full  appearance-none rounded-md border border-muted px-3 py-2 text-black placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Password"
                        />
                    </div>
                    <div>
                        <Button label="Signin" onClick={signinfake} />


                    </div>
                </form>

            </div>
        </div>
    )
}
export default function Page() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Component />
        </Suspense>
    );
}
function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    )
}