"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "../components/Button";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

interface AdminFormData extends FieldValues {
  email: string;
  password: string;
}

export default function AdminComponent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<AdminFormData> = async (data) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/admin/dashboard");
      toast.success("Signed in successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error signing in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link href="/" prefetch={false}>
            <Image 
              src="/images/logo.png" 
              alt="Logo" 
              width={200} 
              height={200} 
              className="mx-auto" 
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl text-[#E2A399] font-bold tracking-tight">
            Admin Portal
          </h2>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-[#E2A399]">
              Email:
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              className="relative block w-full rounded-md border border-muted px-3 py-2 text-black placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              placeholder="Email"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">Email is required</span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-[#E2A399]">
              Password:
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              className="relative block w-full rounded-md border border-muted px-3 py-2 text-black placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              placeholder="Password"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">Password is required</span>
            )}
          </div>

          <Button 
            label={isLoading ? "Signing in..." : "Sign in"} 
            disabled={isLoading}
            onClick={() => {}}
          />
        </form>
      </div>
    </div>
  );
}