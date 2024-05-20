import React, { ReactNode } from "react";

import { ClassNameModule } from "../../module/ui/className";
import { cn } from "@/utils/ui";

export const TextH = ({
  className = "",
  children,
}: {
  children: ReactNode | string;
  className?: string;
}) => {
  const _className = new ClassNameModule(className);
  return (
    <h6 className={cn("font-bold text-xl", _className.getValue())}>
      {children}
    </h6>
  );
};
