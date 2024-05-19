"use client";

import React, { ReactNode, forwardRef, useRef, useState } from "react";
import { AnimatedBeam } from ".";
import { cn } from "@/utils/ui";
import { TextH } from "@/components/common/text/TextH";
import { motion } from "framer-motion";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white  shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

export function AnimatedBeamMultipleOutput({
  root,
  node,
  multiple,
  header,
}: {
  header?: ReactNode;
  node: ReactNode;
  root: ReactNode;
  multiple: [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`rounded-lg border flex flex-col gap-4  w-[500px]  bg-background p-10 md:shadow-xl`}
    >
      {header && <div className="flex w-full items-center ">{header}</div>}
      <div
        className="relative flex w-fullitems-center justify-center overflow-hidden "
        ref={containerRef}
      >
        <div className="flex z-100 h-full w-full flex-row items-stretch justify-between gap-10">
          <div className="flex flex-col justify-center">
            <Circle ref={div7Ref}>{root}</Circle>
          </div>
          <div className="flex flex-col justify-center">
            <Circle ref={div6Ref} className="h-16 w-16">
              {node}
            </Circle>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <Circle ref={div1Ref}>{multiple[0]}</Circle>
            <Circle ref={div2Ref}>{multiple[1]}</Circle>
            <Circle ref={div3Ref}>{multiple[2]}</Circle>
            <Circle ref={div4Ref}>{multiple[3]}</Circle>
            <Circle ref={div5Ref}>{multiple[4]}</Circle>
          </div>
        </div>

        {/* AnimatedBeams */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div1Ref}
          toRef={div6Ref}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div2Ref}
          toRef={div6Ref}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div3Ref}
          toRef={div6Ref}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div4Ref}
          toRef={div6Ref}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div5Ref}
          toRef={div6Ref}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div6Ref}
          toRef={div7Ref}
          duration={3}
        />
      </div>
    </div>
  );
}
