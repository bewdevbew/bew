import * as React from "react";

import { cn } from "@/utils/ui";
import { TextLabel } from "../common/text/TextLabel";
import { useForm } from "@/context/form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: {
    text: string;
    icon: React.ReactNode;
  };
  target: string;
  // require?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", target, label, ...props }, ref) => {
    if (props.max) {
      type = "number";
    }
    const { set, getValue } = useForm();

    return (
      <div className={cn(className, "flex flex-col ")}>
        {label && (
          <TextLabel className="mb-4" icon={label.icon}>
            {label.text}
          </TextLabel>
        )}

        <input
          type={type}
          onChange={(e) => set(target, e.target.value)}
          value={getValue(target) || props?.value || ""}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            (!!!props.required ||
              (type === "number" &&
                props.max &&
                props?.max < getValue(target))) &&
              getValue(target) &&
              "border-red-500"
          )}
          ref={ref}
          {...props}
        />
        {(props.max || props.min) && (
          <div className="flex justify-between items-center">
            {props.min && (
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Min:</span>
                <span className="font-bold text-sm">{props.min}</span>
              </div>
            )}
            {props.max && (
              <div className="flex flex-col ml-auto text-end ">
                <span className="text-xs text-muted-foreground">Max:</span>
                <span className="font-bold text-sm">{props.max}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
