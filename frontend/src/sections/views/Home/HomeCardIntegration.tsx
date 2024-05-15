import { Card } from "@/components/ui/card";
import React from "react";

const images = {
  "15": "/lens-logo.jpeg",
  "19": "/github.webp",
  "28": "/xmtp.png",
  "26": "/notion.png",
};

const size = 100;

export const HomeCardIntegration = () => {
  return (
    <Card
      padding="p-0"
      style={{
        width: `${size * 6}px`,
        height: `${size * 6}px`,
      }}
      className="relative"
    >
      <div
        style={{
          width: `${size * 6 + 16 * 6}px`,
          left: `-${size / 2}px`,
          bottom: `-${size / 2}px`,
        }}
        className={`grid grid-cols-6 absolute   gap-[16px] `}
      >
        {Array.from({ length: 36 }).map((_, i) =>
          (images as any)?.[`${i}`] ? (
            <div
              key={`integration-item-${i}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                zIndex: (images as any)?.[`${i}`] ? 1 : 0,
              }}
              className=" border 5 rounded-lg shadow overflow-hidden p-[2px] relative"
            >
              <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#44D1EE_0%,#44C581_50%,#E2CBFF_100%)]" />

              {(images as any)?.[`${i}`] && (
                <img
                  src={(images as any)?.[`${i}`]}
                  alt="logo"
                  className="w-full rounded-lg relative h-full object-cover"
                />
              )}
            </div>
          ) : (
            <div
              key={`integration-item-${i}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                zIndex: (images as any)?.[`${i}`] ? 1 : 0,
              }}
              className=" border border-info/40 bg-info/5 rounded-lg shadow overflow-hidden"
            ></div>
          )
        )}
      </div>
      <div className="text-xl h-full relative   px-4 py-10 z-1  w-full bg-gradient-to-b from-background via-background/60 to-transparent ">
        <h6 className="text-2xl font-bold">
          Your followers,
          <br />
          Your network,
          <br />
          Your community,
        </h6>

        <span className="opacity-70 text-sm font-semibold normal-case">
          Stay connected to your followers
        </span>
      </div>
    </Card>
  );
};
