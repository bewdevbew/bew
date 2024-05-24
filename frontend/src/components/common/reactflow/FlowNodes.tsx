import { motion } from "framer-motion";
import { Cloud } from "lucide-react";
import React, { memo, ReactNode } from "react";
import { Handle, NodeProps, Position } from "reactflow";
export type TurboNodeData = {
  title: ReactNode;
  icon?: ReactNode;
  subline?: ReactNode;
  info: ReactNode;
};

export const TurboNode = memo(({ data }: NodeProps<TurboNodeData>) => {
  return (
    <>
      <div className=" overflow-visible gradient justify-center items-center  origin-center p-0   shadow z-10 flex rounded-full w-fit h-fit right-0 top-0 absolute translate-x-1/2  -translate-y-1/2">
        <div className="rounded-full flex bg-muted justify-center items-center relative w-fit h-fit p-1 shadow-2xl bg-background grow text-muted-foreground font-bold">
          {data.icon}
        </div>
      </div>

      <motion.div
        initial={{
          width: 0,
          height: 0,
        }}
        animate={{
          width: `200px`,
          height: `100px`,
          minWidth: `100px`,
          minHeight: `100px`,
        }}
        transition={{
          type: "spring",
          duration: 1,
        }}
        className=" rounded-xl flex p-[2px] relative  overflow-hidden gradient"
      >
        <div className="  px-4 py-2 rounded-xl flex items-center h-full  grow relative  gap-3 bg-background">
          {data?.info}
          <div className="flex flex-col h-fit">
            <div className="text-[0.6em] font-bold text-black">
              {data?.title}
            </div>

            {data.subline && (
              <div className=" text-muted-foreground font-light text-[0.5em]">
                {data.subline}
              </div>
            )}
          </div>

          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />
        </div>
      </motion.div>
    </>
  );
});
