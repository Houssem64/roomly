"use client";

import Image from "next/image";
import Link from "next/link";
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
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<AdminFormData> = async (data) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", { ...data, redirect: false });

      if (result?.error) {
        // NextAuth renvoie un message technique : on affiche un texte clair.
        throw new Error("Adresse e-mail ou mot de passe incorrect.");
      }

      // La page /admin/dashboard revérifie de son côté qu'il s'agit bien
      // d'un administrateur : un simple utilisateur sera renvoyé ici.
      toast.success("Connexion réussie");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Connexion impossible.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link href="/" prefetch={false}>
            <Image
              src="/images/logo.png"
              alt="Roomly"
              width={200}
              height={200}
              className="mx-auto h-16 w-auto object-contain"
              priority
            />
          </Link>
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#E2A399]">
            Espace administrateur
          </h1>
          <p className="mt-2 text-center text-sm text-neutral-500">
            Réservé à la gestion des comptes de la plateforme.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-[#E2A399]">
              Adresse e-mail
            </label>
            <input
              id="email"
              {...register("email", { required: true })}
              type="email"
              autoComplete="email"
              disabled={isLoading}
              className="relative mt-1 block w-full rounded-md border border-muted px-3 py-2 text-black placeholder-muted-foreground outline-none focus:border-[#E2A399] focus:ring-1 focus:ring-[#E2A399] disabled:opacity-60 sm:text-sm"
              placeholder="admin@roomly.com"
            />
            {errors.email && (
              <span className="text-sm text-red-500">L&apos;adresse e-mail est obligatoire.</span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-[#E2A399]">
              Mot de passe
            </label>
            <input
              id="password"
              {...register("password", { required: true })}
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              className="relative mt-1 block w-full rounded-md border border-muted px-3 py-2 text-black placeholder-muted-foreground outline-none focus:border-[#E2A399] focus:ring-1 focus:ring-[#E2A399] disabled:opacity-60 sm:text-sm"
              placeholder="••••••••"
            />
            {errors.password && (
              <span className="text-sm text-red-500">Le mot de passe est obligatoire.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#E2A399] py-3 font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          <Link href="/" className="underline hover:text-neutral-800">
            Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
}
