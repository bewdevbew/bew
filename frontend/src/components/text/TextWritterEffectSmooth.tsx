"use client";

import { cn } from "@/utils/ui";
import { motion } from "framer-motion";

export const TextWriterEffectSmooth = ({
  className,
  highlight,
  cursorClassName,
  children,
}: {
  highlight?: string;
  children: string;
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters

  const words = children?.split(" ")?.map((el, i, arr) => ({
    text: el,
    className: highlight
      ? highlight
          .split(" ")
          .map((el) => el.toLowerCase())
          .includes(el.toLowerCase())
        ? "text-info"
        : undefined
      : i === arr.length - 1
      ? "text-blue-500"
      : undefined,
  }));
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });
  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`dark:text-white text-black `, word.className)}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("flex items-end space-x-1 w-fit", className)}>
      <motion.div
        key={children.replace(/\s/g, "")}
        className="overflow-hidden "
        initial={{
          width: "0%",
        }}
        whileInView={{
          width: "fit-content",
        }}
        transition={{
          duration: 1,
          ease: "linear",
          delay: 0.3,
        }}
      >
        <div
          className="text-lg md:text-7xl font-normal  bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {renderWords()}{" "}
        </div>{" "}
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,

          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "block rounded-sm w-[4px]  h-4 sm:h-6 xl:h-12 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};
