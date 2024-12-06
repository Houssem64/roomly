import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export default function NotFound() {
  return (
    <ClientOnly>
      <EmptyState
        title="404"
        subtitle="Page Not Found"
      />
    </ClientOnly>
  );
}