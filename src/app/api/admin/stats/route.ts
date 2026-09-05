import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentAdmin from "@/app/actions/getCurrentAdmin";
import { PaymentStatus } from "@/app/libs/konnect";

export const dynamic = "force-dynamic";

/**
 * Chiffres clés du tableau de bord.
 *
 * Tout est calculé côté serveur : le navigateur ne reçoit que des totaux,
 * jamais la base entière.
 */
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Réservé aux administrateurs." }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      totalOwners,
      newUsers,
      totalListings,
      totalReservations,
      paidReservations,
      pendingReservations,
      failedReservations,
      listings,
      recentRaw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "owner" } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.listing.count(),
      prisma.reservation.count(),
      prisma.reservation.findMany({
        where: { paymentStatus: PaymentStatus.COMPLETED },
        select: { totalPrice: true },
      }),
      prisma.reservation.count({ where: { paymentStatus: PaymentStatus.PENDING } }),
      prisma.reservation.count({ where: { paymentStatus: PaymentStatus.FAILED } }),
      // Peu d'annonces dans ce projet : un regroupement en mémoire est plus
      // simple à lire qu'une agrégation MongoDB, et tout aussi rapide.
      prisma.listing.findMany({ select: { category: true, locationValue: true, price: true } }),
      prisma.reservation.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          listing: { select: { title: true, locationValue: true } },
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    const revenue = paidReservations.reduce((sum, r) => sum + r.totalPrice, 0);

    const tally = (rows: { [k: string]: any }[], key: string) => {
      const counts = new Map<string, number>();
      for (const row of rows) {
        const value = row[key] || "Non précisé";
        counts.set(value, (counts.get(value) || 0) + 1);
      }
      return Array.from(counts, ([label, count]) => ({ label, count })).sort(
        (a, b) => b.count - a.count
      );
    };

    const averagePrice = listings.length
      ? Math.round(listings.reduce((s, l) => s + l.price, 0) / listings.length)
      : 0;

    return NextResponse.json({
      kpis: {
        totalUsers,
        totalOwners,
        newUsers,
        totalListings,
        totalReservations,
        revenue,
        pendingReservations,
        failedReservations,
        averagePrice,
      },
      byCategory: tally(listings, "category"),
      byCity: tally(listings, "locationValue").slice(0, 8),
      recentReservations: recentRaw.map((r) => ({
        id: r.id,
        createdAt: r.createdAt.toISOString(),
        startDate: r.startDate.toISOString(),
        endDate: r.endDate.toISOString(),
        totalPrice: r.totalPrice,
        paymentStatus: r.paymentStatus,
        listingTitle: r.listing.title,
        city: r.listing.locationValue,
        userName: r.user.name,
        userEmail: r.user.email,
      })),
    });
  } catch (error) {
    console.error("ADMIN_STATS_ERROR", error);
    return NextResponse.json({ error: "Calcul des statistiques impossible." }, { status: 500 });
  }
}
