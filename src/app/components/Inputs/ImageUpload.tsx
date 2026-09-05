"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { BeatLoader } from "react-spinners";
import toast from "react-hot-toast";

interface ImageUploadProps {
    onChange: (value: string) => void;
    value: string;
}

/**
 * Choix d'une photo depuis l'ordinateur.
 *
 * Le fichier part vers /api/upload, qui l'enregistre dans public/uploads.
 * Aucun service externe n'est utilisé : tout reste sur la machine.
 */
const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const upload = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Veuillez choisir une image (JPG, PNG ou WEBP).");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "L'envoi de l'image a échoué.");
            }

            onChange(data.url);
            toast.success("Photo ajoutée");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "L'envoi de l'image a échoué.");
        } finally {
            setIsUploading(false);
        }
    }, [onChange]);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) upload(file);
        // On réinitialise le champ pour pouvoir renvoyer deux fois le même fichier.
        event.target.value = "";
    }, [upload]);

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) upload(file);
    }, [upload]);

    const handleRemove = useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
        onChange("");
    }, [onChange]);

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
            />

            <div
                onClick={() => !isUploading && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                    relative cursor-pointer hover:opacity-70 transition
                    border-dashed border-2 p-20
                    flex flex-col justify-center items-center gap-4
                    text-neutral-600
                    ${isDragging ? "border-[#E2A399] bg-neutral-50" : "border-neutral-300"}
                `}
            >
                {isUploading ? (
                    <>
                        <BeatLoader color="#E2A399" />
                        <div className="font-semibold text-lg">Envoi en cours...</div>
                    </>
                ) : (
                    <>
                        <TbPhotoPlus size={50} />
                        <div className="font-semibold text-lg">Cliquez pour ajouter une photo</div>
                        <div className="text-sm text-neutral-500">
                            ou glissez-déposez une image ici — JPG, PNG ou WEBP, 5 Mo max.
                        </div>
                    </>
                )}

                {value && !isUploading && (
                    <div className="absolute inset-0 w-full h-full">
                        <Image src={value} alt="Photo du bien" style={{ objectFit: "cover" }} fill />
                        <button
                            type="button"
                            onClick={handleRemove}
                            aria-label="Retirer la photo"
                            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-neutral-100 transition"
                        >
                            <IoClose size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
