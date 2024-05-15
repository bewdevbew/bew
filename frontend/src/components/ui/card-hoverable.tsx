import React, { ReactNode } from "react";
import { Card } from "./card";
import { cn } from "@/utils/ui";
import Image from "next/image";

export const CardHoverable = ({
  images,
  title,
  description,
  children,
  className,
}: {
  className?: string;
  description: string;
  children?: ReactNode;
  title: string;
  images: { img: `/${string}`; className?: string }[];
}) => {
  return (
    <Card
      className={cn(
        "w-[800px] transition hover:scale-105    items-end",
        className || "hover:bg-info/5"
      )}
    >
      {children && children}
      <div className=" flex p-10 pb-10 items-end gap-4">
        <div className="flex w-fit">
          {images.map((el, i) => (
            <Image
              key={`image-${title.replace(" ", "-")}-${i}`}
              width={80}
              height={80}
              alt={"logo " + title}
              src={el.img}
              className={cn(
                " border shadow-xl rounded-md ",
                images.length === 1
                  ? "-rotate-3"
                  : i === 0
                  ? "-rotate-12"
                  : "rotate-12",
                el?.className
              )}
            />
          ))}
        </div>
        <div className="flex  flex-col">
          <h6 className="font-black text-3xl">{title}</h6>
          <p className="text-xl">{description}</p>
        </div>
      </div>
    </Card>
  );
};
