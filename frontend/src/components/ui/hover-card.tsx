"use client";
import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@/utils/ui";
import { Button } from "./button";
import { CircleAlert } from "lucide-react";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

const MyHoverCard = ({
  trigger = <CircleAlert />,
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button className={cn("w-fit rounded-full", className)}>
          {trigger}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit">{children}</HoverCardContent>
    </HoverCard>
  );
};

export { MyHoverCard as HoverCard, HoverCardTrigger, HoverCardContent };
