import { NextResponse } from "next/server";
import getCurrentAdmin from "@/app/actions/getCurrentAdmin";
import { getPaymentMode, setPaymentMode, PaymentMode } from "@/app/libs/settings";
import { isKonnectConfigured } from "@/app/libs/konnect";
import prisma from "@/app/libs/prismadb";
import { PaymentStatus } from "@/app/libs/konnect";

export const dynamic = "force-dynamic";

/** Réglages actuels de la plateforme. */
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 401 });
  }

  try {
    const [paymentMode, pendingCount] = await Promise.all([
      getPaymentMode(),
      prisma.reservation.count({ where: { paymentStatus: PaymentStatus.PENDING } }),
    ]);

    return NextResponse.json({
      paymentMode,
      konnectConfigured: isKonnectConfigured(),
      konnectApiUrl: process.env.KONNECT_API_URL || "https://api.preprod.konnect.network/api/v2",
      pendingPayments: pendingCount,
    });
  } catch (error) {
    console.error("ADMIN_SETTINGS_GET_ERROR", error);
    return NextResponse.json({ error: "Lecture des réglages impossible." }, { status: 500 });
  }
}

/** Modification d'un réglage. */
export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 401 });
  }

  try {
    const { paymentMode } = await request.json();

    if (paymentMode !== PaymentMode.KONNECT && paymentMode !== PaymentMode.DEMO) {
      return NextResponse.json({ error: "Mode de paiement inconnu." }, { status: 400 });
    }

    if (paymentMode === PaymentMode.KONNECT && !isKonnectConfigured()) {
      return NextResponse.json(
        {
          error:
            "Impossible d'activer Konnect : KONNECT_API_KEY et KONNECT_WALLET_ID " +
            "ne sont pas renseignés dans le fichier .env.",
        },
        { status: 400 }
      );
    }

    await setPaymentMode(paymentMode);
    console.log("ADMIN_SETTINGS", admin.email, "payment_mode ->", paymentMode);

    return NextResponse.json({ paymentMode });
  } catch (error) {
    console.error("ADMIN_SETTINGS_PATCH_ERROR", error);
    return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
  }
}
