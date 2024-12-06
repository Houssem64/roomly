"use client";

import { useRouter } from "next/navigation";
import Heading from "./Heading";
import Button from "./Button";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  resetLabel?: string;
  onReset?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No exact matches",
  subtitle = "Try changing or removing some of your filters",
  showReset,
  resetLabel = "Remove all filters",
  onReset
}) => {
  const router = useRouter();

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
      <Heading
        center
        title={title}
        subtitle={subtitle}
      />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label={resetLabel}
            onClick={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;