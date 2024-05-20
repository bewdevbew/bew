import { cn } from "@/utils/ui";
import React, { ReactNode } from "react";

export const TextLabel = ({
  children,
  icon,
  className,
}: {
  className?: string;
  children: string;
  icon: ReactNode;
}) => {
  return (
    <div
      className={cn("flex gap-4 items-center text-muted-foreground", className)}
    >
      {icon}
      <label className="font-semibold">{children}</label>
    </div>
  );
};
