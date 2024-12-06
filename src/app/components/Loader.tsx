"use client";

import { PuffLoader } from "react-spinners";

interface LoaderProps {
  size?: number;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 100,
  color = "#E2A399"  // Your theme color
}) => {
  return (
    <PuffLoader
      size={size}
      color={color}
      aria-label="Loading..."
    />
  );
};

export default Loader;