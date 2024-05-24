import { cn } from "@/utils/ui";
import { ArrowDownRight, Lock, Pencil } from "lucide-react";
import React, { ReactNode, useState } from "react";
type TVariant = "default" | "dot";
type TFooter = {
  onClick?: any;
  value?: boolean;
  title?: ReactNode | string;
  children?: ReactNode;
};

export type CardType = {
  variant?: TVariant;
  layoutId?: string;
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
import { m, motion } from "framer-motion";
import { Input } from "./input";
import { useForm } from "@/context/form";
import { Button } from "./button";

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
  layoutId = "all",
}: CardType) => {
  if (footer !== undefined && footer === true && header?.title) {
    footer = {
      title: `See more ${header?.title}`,
    };
  }

  const { getValue, set } = useForm();
  const { data: moduleSystem, set: setModule } = useModule();
  const classNameModule = moduleSystem?.card?.className?.value;
  const [isHover, setIsHover] = useState(false);

  const localState = moduleSystem?.ids?.[layoutId];
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (event: any, info: any) => {
    setPosition({ x: info.point.x, y: info.point.y });
  };

  if (isHover) {
    console.log({
      layoutId,
      test: getValue(`className-${layoutId}`),
      position,
      moduleSystem,
    });
  }
  return (
    <motion.div
      drag
      onDrag={handleDrag}
      dragConstraints={constraintsRef}
      transition={{ type: "spring", damping: 10, delay: 0.5 }}
      initial={{
        x: 0,
        y: 0,
      }}
      animate={{
        x: localState?.position?.x || 0,
        y: localState?.position?.y || 0,
      }}
      onHoverStart={() => {
        set("card-hovered", layoutId);
        setIsHover(true);
      }}
      onHoverEnd={() => {
        set("card-hovered", null);
        setIsHover(false);
      }}
      onClick={onClick}
      style={style}
      className={cn(
        padding,
        `${width} ${height}   shadow-lg  flex border relative rounded-lg flex-col`,
        !["ADMIN", "DEV"].includes(module) && classNameModule,
        cardVariants({ variant, className: className }),
        // TODO faire avec les keys
        getValue(`className-${layoutId}`) || getValue(`className-all`),
        getValue("card-hovered") === layoutId && "border-info"
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHover ? 1 : 0,
        }}
        className="absolute bottom-0 right-0 translate-x-full translate-y-full  "
      >
        <>
          {layoutId !== "all" && (
            <Button
              onClick={() => {
                setModule(
                  "ids" as any,
                  {
                    ...moduleSystem?.ids,
                    [layoutId]: {
                      className:
                        getValue(`className-${layoutId}`) ||
                        getValue(`className-all`),
                      position: position,
                    },
                  } as any
                );
              }}
              variant={"ghost"}
              className="text-info"
            >
              <Lock />
            </Button>
          )}

          <div className="flex items-center gap-5 text-info">
            <Input
              label={{ icon: <Pencil />, text: "Edit className" }}
              target={`className-${layoutId}`}
              placeholder="Custom Card"
            />
          </div>
        </>
      </motion.div>
    </motion.div>
  );
};
