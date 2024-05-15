import React, { ReactNode } from "react";
import { Card } from "./card";
import { ArrowDownCircleIcon } from "lucide-react";
import { Button } from "../button";
import { motion } from "framer-motion";

export const CardCollapsible = ({
  children,
  header,
  className,
}: {
  className?: string;
  children: ReactNode;
  header: { title: string | ReactNode; icon?: ReactNode };
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Card
      className={className}
      header={{
        title: (
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-between items-center"
          >
            {header.title}
            <>
              <ArrowDownCircleIcon className="cursor-pointer" />
            </>
          </div>
        ) as unknown as string,
        icon: header.icon || <></>,
      }}
    >
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? "auto" : 0, padding: isOpen ? 10 : 0 }}
        className=" w-full"
      >
        {children}
      </motion.div>
    </Card>
  );
};
