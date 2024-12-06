import { Suspense } from "react";
import DashboardComponent from "./DashboardComponent";
import Loader from "@/app/components/Loader";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
// Dynamically import the component that uses browser APIs


export default async function DashboardPage() {
    try {
        return (
            <ClientOnly>
                <Suspense fallback={<Loader />}>
                    <DashboardComponent />
                </Suspense>
            </ClientOnly>
        );
    } catch (error) {
        console.error('Error:', error);
        return <EmptyState 
            title="Error" 
            subtitle="Something went wrong while loading the dashboard" 
        />;
    }
}