import { cn } from "@/utils/ui";
import React from "react";

export const Logo = ({
  size = 44,
  className,
}: {
  className?: string;
  size?: number | `${number}`;
}) => {
  return (
    <img
      src="/logo.webp"
      style={{ width: size, height: size }}
      className={cn("rounded-lg shadow", className)}
      alt="logo-app"
    />
  );
};
