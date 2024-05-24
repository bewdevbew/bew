"use client";
import { SizeModule } from "../module/ui/size";
import { VariantProps, cva } from "class-variance-authority";
import { VariantsModule } from "../module/ui/variants";

import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/ui";
import { useModule } from "@/hooks/useModule";
import Link from "next/link";

const defaultVariants = new VariantsModule({
  state: "outline",
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
});

const defaultSize = new SizeModule({
  state: "default",
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
});

const buttonVariants = cva(
  "inline-flex items-center shadow justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: defaultVariants.default,
        destructive: defaultVariants.destructive,
        outline: defaultVariants.outline,
        secondary: defaultVariants.secondary,
        ghost: defaultVariants.ghost,
        link: defaultVariants.link,
      },
      size: {
        default: defaultSize.default,
        sm: defaultSize.sm,
        lg: defaultSize.lg,
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: defaultVariants.state,
      size: defaultSize.state,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  module?: "ADMIN" | "USER" | "USER SAFE" | "DEV" | "DEV SAFE";
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      href,
      module = "USER",
      variant,
      size,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const { data: moduleSystem } = useModule();
    const classNameModule = moduleSystem?.button?.className?.value;

    if (href) {
      return (
        <Link
          className={cn(
            buttonVariants({
              variant,
              size,
              className:
                !["ADMIN", "DEV", "DEV_SAFE"].includes(module) &&
                classNameModule,
            }),
            className
          )}
          href={href}
          style={props.style}
        >
          {props?.children}
        </Link>
      );
    }

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            className:
              !["ADMIN", "DEV", "DEV_SAFE"].includes(module) && classNameModule,
          }),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
