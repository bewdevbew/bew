import { cn } from "@/utils/ui";
import { ArrowDownRight } from "lucide-react";
import React, { ReactNode } from "react";

type TFooter = {
  onClick?: any;
  value?: boolean;
  title?: ReactNode | string;
  children?: ReactNode;
};

import { cva, type VariantProps } from "class-variance-authority";
import { HeaderCard } from "./header-card";

const cardVariants = cva("bg-background", {
  variants: {
    variant: {
      default: "",
      dot: "dark:bg-dot-thick-neutral-800 backdrop-blur-2xl  bg-dot-thick-neutral-300",
    },
  },
  defaultVariants: {
    variant: "default",
    // size: "default",
  },
});

type TVariant = "default" | "dot";

export const Card = ({
  children,
  header,
  width = "min-w-[450px] ",
  height = "h-fit",
  className = " gap-2",
  padding = "p-4",
  footer,
  onClick,
  variant = "default",
  style,
}: {
  variant?: TVariant;
  children: ReactNode;
  header?: {
    icon?: any;
    button?: ReactNode;
    title: ReactNode;
  };
  onClick?: any;
  height?: string;
  style?: any;
  padding?: string;
  width?: string | number;
  className?: string;
  footer?: TFooter | true;
}) => {
  if (footer !== undefined && footer === true && header?.title) {
    footer = {
      title: `See more ${header?.title}`,
    };
  }
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        padding,
        `${width} ${height}  shadow  flex border overflow-hidden rounded-lg flex-col`,
        cardVariants({ variant }),

        className
      )}
    >
      {header ? (
        <HeaderCard button={header.button} icon={header.icon} className="mb-3">
          {header.title}
        </HeaderCard>
      ) : (
        <></>
      )}
      {children}
      {footer !== true && footer !== undefined ? (
        <div
          onClick={typeof footer === "object" && footer?.onClick}
          className={cn(
            "p-4 py-5 flex items-center border-t",
            !footer?.children && "text-info",
            footer.onClick && "cursor-pointer hover:bg-secondary/10"
          )}
        >
          {footer?.children || (
            <>
              {footer?.title}
              <ArrowDownRight
                className={`transition ${!footer.value ? "" : "rotate-180"}`}
              />
            </>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
