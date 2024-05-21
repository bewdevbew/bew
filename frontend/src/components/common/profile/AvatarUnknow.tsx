"use client";
import React, { useEffect, useState } from "react";

import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import { ethers } from "ethers";
import { cn } from "@/utils/ui";

export const AvatarUnknow = ({
  seed = ethers.ZeroAddress,
  color,
  size = 50,
  className,
}: {
  className?: string;
  color?: string;
  seed?: string;

  size?: number;
}) => {
  let [src, setSrc] = useState<string | null>(null);
  const generateAvatar = () => {
    setSrc(
      createAvatar(lorelei, {
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
        alt={`avatar ${seed}`}
      />
    );
  }
};
