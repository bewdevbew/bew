import { motion } from "framer-motion";
import React, { ReactNode, useRef } from "react";

export const ModuleLayout = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div className={className} ref={constraintsRef}>
      {children}
    </motion.div>
  );
};
