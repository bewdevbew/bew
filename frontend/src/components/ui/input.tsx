import * as React from "react";

import { cn } from "@/utils/ui";
import { TextLabel } from "../common/text/TextLabel";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: {
    text: string;
    icon: React.ReactNode;
  };
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, ...props }, ref) => {
    return (
      <div className={cn(className, "flex flex-col gap-4")}>
        {label && <TextLabel icon={label.icon}>{label.text}</TextLabel>}

        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
