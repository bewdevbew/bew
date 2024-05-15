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
    title: string;
  };
  onClick?: any;
  height?: string;
  style?: any;
  padding?: string;
  width?: string | number;
  className?: string;
  footer?: TFooter | true;
}) => {
  if (footer !== undefined && footer === true) {
    footer = {
      title: `See more ${header?.title.toLowerCase()}`,
    };
  }
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        !header && padding,
        `${width} ${height}  shadow  flex border overflow-hidden rounded-lg flex-col`,
        cardVariants({ variant }),

        className
      )}
    >
      {header ? (
        <div className="w-full px-4 py-2  bg-secondary flex items-center gap-4 border-b text-left">
          {header?.icon && (
            <span className="opacity-80 text-[44px] bg-background/50 p-2 rounded shadow">
              {header.icon}
            </span>
          )}
          <div className="font-semibold w-full whitespace-nowrap">
            {header.title}
          </div>
        </div>
      ) : (
        <></>
      )}
      {children}
      {footer !== undefined ? (
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
