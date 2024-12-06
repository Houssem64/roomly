import EmptyState from "./EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      title="404 - Not Found"
      subtitle="The page you're looking for doesn't exist"
      showReset
      resetLabel="Go Home"
    />
  );
}