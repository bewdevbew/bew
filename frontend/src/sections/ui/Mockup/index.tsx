import React, { ReactNode } from "react";
import "./styles.css";
import { cn } from "@/utils/ui";

export const Mockup = ({
  className,
  children = "Analyse ...",
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("terminal-loader w-[24em]", className)}>
      <div className="terminal-header h-[1.7em]">
        <div className="terminal-title ">dew_Ai</div>
        <div className="terminal-controls">
          <div className="control close"></div>
          <div className="control minimize"></div>
          <div className="control maximize"></div>
        </div>
      </div>
      <pre className="text">{children}</pre>
    </div>
  );
};
