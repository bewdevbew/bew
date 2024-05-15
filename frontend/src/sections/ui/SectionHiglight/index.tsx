import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";

import React, { ReactNode, useRef, useState } from "react";

export const SectionHighlight = ({
  color = "#428AEB",
  label,
  highlight,
  description,
  icon,
  children,
  btn,
}: {
  btn?: { children: ReactNode; onClick?: any; href?: string };
  highlight: string;
  description: string | ReactNode;
  label: string;
  icon: ReactNode | any;
  children?: ReactNode;
  color?: "#F778BA" | "#7042C4" | "#428AEB";
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  const [btnIsHover, setBtnIsHover] = useState(false);
  return (
    <div className="flex flex-col w-[60vw]">
      <div ref={ref} className="flex items-center gap-10 ">
        <div className="flex flex-col h-[50vh] gap-4 items-center">
          <motion.div
            style={{
              background: `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${color} 90%, rgba(255, 255, 255, 0) 100%)`,
            }}
            whileInView={{ scaleY: 1 }}
            initial={{ scaleY: 0.1 }}
            className={`w-[3px]  h-[25vh]`}
            transition={{ duration: 3, delay: 0.5, type: "spring" }}
          ></motion.div>

          {icon}

          <motion.div
            style={{
              background: `linear-gradient(180deg,  ${color} 0%, rgba(255, 255, 255, 0) 100%)`,
            }}
            whileInView={{ scaleY: 1 }}
            initial={{ scaleY: 0.1 }}
            className={`w-[3px] h-[25vh] `}
            transition={{ duration: 3, delay: 0.5, type: "spring" }}
          ></motion.div>
        </div>
        <div className="translate-y-1/2  flex flex-col gap-6">
          <h6 className="font-bold text-xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500">
            {label}
          </h6>
          <div className="text-5xl  font-semibold">
            <p style={{ color }} className={`text-[${color}]`}>
              {highlight}
            </p>
            <p className="text-3xl mt-4 opacity-80 font-medium">
              {description}
            </p>
          </div>
          <Button
            //TODO
            // href={btn?.href}
            onMouseEnter={() => setBtnIsHover(true)}
            onMouseLeave={() => setBtnIsHover(false)}
            style={
              btnIsHover
                ? {
                    color: "white",
                    background: color,
                  }
                : {
                    borderColor: color,
                    color,
                  }
            }
            onClick={btn?.onClick}
          >
            {/* {console.log({ classname: `hover:bg-[${color}]` })} */}
            {btn?.children}
          </Button>
        </div>
        <motion.div
          whileInView={{ scaleY: 1 }}
          initial={{ scaleY: 0.1 }}
          style={{
            background: `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${color} 90%, rgba(255, 255, 255, 0) 100%)`,
          }}
          className={`w-[3px]  ml-auto h-[50vh]`}
          transition={{ duration: 3, delay: 0.5, type: "spring" }}
        ></motion.div>
      </div>
      {children}
    </div>
  );
};
