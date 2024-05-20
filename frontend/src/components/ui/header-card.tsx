import { ReactNode } from "react";
import { TextH } from "../common/text/TextH";
import { cn } from "@/utils/ui";

export const HeaderCard = ({
  icon,
  children,
  button,
  className,
}: {
  className?: string;
  icon: ReactNode;
  children: ReactNode;
  button?: ReactNode;
}) => {
  return (
    <div className={cn("flex justify-between gap-10", className)}>
      <div className="flex gap-5 items-center font-bold text-xl">
        <div className="p-4 rounded-full shadow border">{icon}</div>
        {children}
      </div>
      {button}
    </div>
  );
};
