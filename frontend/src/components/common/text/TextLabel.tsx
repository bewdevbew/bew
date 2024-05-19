import React, { ReactNode } from "react";

export const TextLabel = ({
  children,
  icon,
}: {
  children: string;
  icon: ReactNode;
}) => {
  return (
    <div className="flex gap-4 items-center text-muted-foreground">
      {icon}
      <label className="font-semibold">{children}</label>
    </div>
  );
};
