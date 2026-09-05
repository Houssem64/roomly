import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

import getCurrentUser from "@/app/actions/getCurrentUser";

/**
 * Enregistrement des photos SUR CE PC (remplace Cloudinary).
 *
 * Le fichier envoyé par le navigateur est écrit dans public/uploads/ et
 * la route renvoie son chemin public, par exemple "/uploads/a1b2c3.jpg".
 * Next.js sert automatiquement tout ce qui se trouve dans public/.
 */

const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

// On n'accepte que de vraies images, et on impose nous-mêmes l'extension :
// le nom de fichier envoyé par le navigateur n'est jamais utilisé tel quel.
const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Vous devez être connecté." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    const extension = ALLOWED[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: "Format non supporté. Utilisez une image JPG, PNG ou WEBP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image trop lourde (5 Mo maximum)." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    // Vérification du contenu réel du fichier, pas seulement du type annoncé
    // par le navigateur : on lit les premiers octets ("magic number").
    if (!looksLikeImage(bytes)) {
      return NextResponse.json(
        { error: "Ce fichier n'est pas une image valide." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${crypto.randomUUID()}${extension}`;
    await writeFile(path.join(uploadDir, filename), bytes);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("UPLOAD_ERROR", error);
    return NextResponse.json(
      { error: "L'enregistrement de l'image a échoué." },
      { status: 500 }
    );
  }
}

/** Reconnaît les signatures binaires JPEG, PNG et WEBP. */
function looksLikeImage(buf: Buffer): boolean {
  if (buf.length < 12) return false;

  // JPEG : FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;

  // PNG : 89 50 4E 47 0D 0A 1A 0A
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return true;
  }

  // WEBP : "RIFF" .... "WEBP"
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") {
    return true;
  }

  return false;
}
