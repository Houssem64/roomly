import { unlink } from "fs/promises";
import path from "path";

const UPLOADS_ROOT = () => path.join(process.cwd(), "public", "uploads");

/**
 * Supprime une photo envoyée par un utilisateur (dossier public/uploads).
 *
 * Trois garde-fous :
 *   1. seuls les chemins commençant par /uploads/ sont pris en compte —
 *      une adresse internet ou l'image par défaut sont ignorées ;
 *   2. les photos de démonstration (/uploads/seed/) ne sont JAMAIS effacées :
 *      plusieurs annonces partagent le même fichier ;
 *   3. le chemin final doit rester à l'intérieur de public/uploads, ce qui
 *      neutralise les tentatives du type "../../.env".
 *
 * Ne lève jamais d'erreur : la suppression d'une photo ne doit pas faire
 * échouer la suppression de l'annonce ou du compte.
 */
export async function deleteLocalUpload(imageSrc?: string | null): Promise<void> {
  if (!imageSrc || !imageSrc.startsWith("/uploads/")) return;

  // Photos de démonstration : partagées, donc intouchables.
  if (imageSrc.startsWith("/uploads/seed/")) return;

  const relative = imageSrc.slice("/uploads/".length);
  if (!relative || relative === ".gitkeep") return;

  const root = UPLOADS_ROOT();
  const target = path.resolve(root, relative);

  // Le fichier visé doit se trouver sous public/uploads.
  if (target !== root && !target.startsWith(root + path.sep)) return;

  try {
    await unlink(target);
  } catch {
    // Fichier déjà absent, partagé, ou verrouillé : sans conséquence.
  }
}
