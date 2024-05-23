import { cn } from "@/utils/ui";
import { ArrowDownRight } from "lucide-react";
import React, { ReactNode } from "react";
type TVariant = "default" | "dot";
type TFooter = {
  onClick?: any;
  value?: boolean;
  title?: ReactNode | string;
  children?: ReactNode;
};

export type CardType = {
  variant?: TVariant;
  children: ReactNode;
  header?: {
    icon?: any;
    button?: ReactNode;
    title: ReactNode;
  };
  constraintsRef?: React.RefObject<HTMLDivElement>;
  module?: "ADMIN" | "DEV" | "USER" | "USER SAFE" | "DEV SAFE";
  onClick?: any;
  height?: string;
  style?: any;
  padding?: string;
  width?: string | number;
  className?: string;
  footer?: TFooter | true;
};

import { cva, type VariantProps } from "class-variance-authority";
import { HeaderCard } from "./header-card";
import { useModule } from "@/hooks/useModule";
import { motion } from "framer-motion";

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

export const Card = ({
  children,
  constraintsRef,
  header,
  width = "min-w-[450px] ",
  height = "h-fit",
  className = " gap-2",
  padding = "p-4",
  footer,
  module = "USER",
  onClick,
  variant = "default",
  style,
}: CardType) => {
  if (footer !== undefined && footer === true && header?.title) {
    footer = {
      title: `See more ${header?.title}`,
    };
  }

  const { data: moduleSystem } = useModule();
  const classNameModule = moduleSystem?.card?.className?.value;

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      onClick={onClick}
      style={style}
      className={cn(
        padding,
        `${width} ${height}  shadow-lg  flex border overflow-hidden rounded-lg flex-col`,
        !["ADMIN", "DEV"].includes(module) && classNameModule,
        cardVariants({ variant, className: className })
      )}
    >
      {header ? (
        <HeaderCard
          button={header.button}
          icon={header.icon}
          className="pb-3 border-b mb-2"
        >
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
    </motion.div>
  );
};
