"use client";
import React, { useEffect, useState } from "react";

import { createAvatar } from "@dicebear/core";
import { rings } from "@dicebear/collection";
import { ethers } from "ethers";
import { cn } from "@/utils/ui";

export const TokenAvatar = ({
  seed = ethers.ZeroAddress as any,
  color,
  size = 50,
  className,
}: {
  className?: string;
  color?: string;
  seed?: `0x${string}`;

  size?: number;
}) => {
  let [src, setSrc] = useState<string | null>(null);
  const generateAvatar = () => {
    setSrc(
      createAvatar(rings, {
        seed: seed?.toLowerCase(),
      }).toDataUriSync()
    );
  };

  useEffect(() => {
    generateAvatar();

    return () => {
      setSrc(null);
    };
  }, [seed]);

  if (src) {
    return (
      <img
        onError={generateAvatar}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          maxWidth: `${size}px`,
          maxHeight: `${size}px`,
          minHeight: `${size}px`,
          minWidth: `${size}px`,
          backgroundColor: color,
        }}
        className={cn(
          `shadow rounded-full border `,
          !color && "bg-background",
          className
        )}
        src={src}
        alt={`avatar tokenAvatar ${seed}`}
      />
    );
  }
};
