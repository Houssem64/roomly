'use client';
import axios from "axios";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../Inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import { useRouter } from "next/navigation";
const LoginModal = () => {
    const registerModal = useRegisterModal();
    const LoginModal = useLoginModal();
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

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        signIn('credentials', {
            ...data,
            redirect: false,
        }).then((callback) => {
            setIsLoading(false);
            if (callback?.ok) {
                toast.success('Logged in successfully');
                router.refresh();
                LoginModal.onClose();
            }
            if (callback?.error) {
                toast.error(callback.error);
            }
        })
    };
    const toggle = useCallback(() => {
        LoginModal.onClose();
        registerModal.onOpen();
    }, [LoginModal, registerModal])
    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Welcome Back"
                subtitle="Login to your account "
            />
            <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />

            <Input id="password" type="password" label="Password" disabled={isLoading} register={register} errors={errors} required />
        </div>
    );
    const footerContent = (
        <div className="flex flex-col gap-4 mt-3 ">
            <hr />
            <Button outline label="Continue with Google" icon={FcGoogle}
                onClick={() => { signIn("google", { callbackUrl: '/' }) }}
            />
            <div className="text-neutral-500 text-center mt-4 font-light" >
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>
                        Don't have an account?
                    </div>
                    <div onClick={toggle} className="text-neutral-800 cursor-pointer hover:underline" >
                        Register
                    </div>

                </div>
            </div>
        </div>

    )
    return (

        <Modal
            disabled={isLoading}
            isOpen={LoginModal.isOpen}
            onClose={LoginModal.onClose}
            title="Login"
            actionLabel="Continue"
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default LoginModal;