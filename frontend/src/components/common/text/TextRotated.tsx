"use client";

import { cn } from "@/utils/ui";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface WordRotateProps {
  words: string[];
  duration?: number;
  framerProps?: HTMLMotionProps<"h1">;
  className?: string;
  colors?: string[];
}

export const TextRotate = ({
  words,
  duration = 2500,
  framerProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  colors,

  className,
}: WordRotateProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <div
      className={cn(
        "overflow-hidden py-2 ",
        colors && "flex items-center gap-4"
      )}
    >
      {colors && (
        <motion.div
          key={"color-text-rotate" + index}
          transition={{ duration: 1 }}
          initial={{ backgroundColor: "#000" }}
          animate={{ backgroundColor: colors?.[index] || "#000" }}
          className="p-3 border shadow rounded-full  w-fit"
        />
      )}
      <AnimatePresence mode="wait">
        <motion.h1
          key={words[index]}
          className={cn(className)}
          animate={colors ? { color: colors?.[index] } : framerProps?.animate}
          {...framerProps}
        >
          {words[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};
