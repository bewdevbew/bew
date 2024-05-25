import { HoverCard } from "@/components/ui/hover-card";
import React from "react";

export const TextTruncated = ({
  children,
  maxLength = 100,
  hover = false,
}: {
  hover?: boolean;
  children: string;
  maxLength: number;
}) => {
  if (children?.length <= maxLength) {
    return <>{children}</>;
  }
  if (hover) {
    return (
      <HoverCard
        trigger={<span>{children?.substring?.(0, maxLength) + "..."}</span>}
      >
        {children}
      </HoverCard>
    );
  }
  return <>{children?.substring?.(0, maxLength) + "..."}</>;
};
