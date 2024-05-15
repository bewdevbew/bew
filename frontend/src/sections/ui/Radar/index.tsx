"use client";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { IcGithub, IcLinkedin, IcNotion } from "@/constants/icon";

const RadarComponent = ({ className }: any) => {
  const circles = new Array(8).fill(1);
  return (
    <div
      className={twMerge(
        "relative flex h-20 w-20 items-center justify-center rounded-full  ",
        className
      )}
    >
      <motion.div
        initial={{
          rotate: 0,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute  translate-y-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-600 to-transparent top-1/2  z-40 flex h-[5px]
        overflow-hidden  w-[800px]   items-end justify-center "
      />

      {circles.map((_, idx) => (
        <Circle
          style={{
            height: `${(idx + 1) * 5}rem`,
            width: `${(idx + 1) * 5}rem`,
            border: `1px solid rgba(71, 85, 105, ${1 - (idx + 1) * 0.1})`,
          }}
          key={`motion-${idx}`}
          idx={idx}
        />
      ))}
    </div>
  );
};

const Circle = ({ className, children, idx, ...rest }: any) => {
  return (
    <motion.div
      {...rest}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: idx * 0.1,
        duration: 0.2,
      }}
      className={twMerge(
        "absolute inset-0 left-1/2 top-1/2 h-10 w-10  -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-neutral-200",
        className
      )}
    ></motion.div>
  );
};

const IconContainer = ({ icon, text, delay }: any) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.2,
        delay: delay ? delay : 0,
      }}
      className={twMerge(
        "relative z-50 flex flex-col items-center justify-center space-y-2"
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 shadow-inner">
        {icon}
      </div>
      <div className="hidden rounded-md px-2 py-1 md:block">
        <div className="text-center text-xs font-bold text-slate-400">
          {text}
        </div>
      </div>
    </motion.div>
  );
};

export const Radar = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative rounded-lg flex h-96 w-full flex-col items-center justify-center space-y-4 overflow-hidden px-4 ">
        <div className="mx-auto w-full max-w-md">
          <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0 ">
            <IconContainer
              text="LinkedIn Integration"
              icon={<IcLinkedin className="  text-slate-600 text-[54px]" />}
              delay={0.8}
            />
          </div>
        </div>
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0 ">
            <IconContainer
              delay={0.6}
              text="GitHub Integration"
              icon={<IcGithub className="  text-slate-600 text-[54px]" />}
            />
            <IconContainer
              delay={0.7}
              text="Notion Integration"
              icon={<IcNotion className="  text-slate-600 text-[54px]" />}
            />
          </div>
        </div>

        <RadarComponent className="absolute -bottom-12" />
        <div className="absolute bottom-0 z-[41] h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </div>
      <img
        src="/logo.webp"
        className="w-[74px] z-50 h-[74px] rounded-lg border border-secondary/5 shadow   -translate-y-1/2"
      />
    </div>
  );
};
