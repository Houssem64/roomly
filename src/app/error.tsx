"use client";

import { useEffect } from "react";
import EmptyState from "./components/EmptyState";

interface ErrorStateProps {
  error: Error;
  reset: () => void;  // Next.js provides this to reset the error boundary
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  reset 
}) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      title="Uh Oh"
      subtitle="Something went wrong!"
      showReset
      resetLabel="Try again"
      onReset={reset}
    />
  );
};

export default ErrorState;