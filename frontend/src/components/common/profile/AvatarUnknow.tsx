"use client";
import React, { useEffect, useState } from "react";

import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import { ethers } from "ethers";

export const AvatarUnknow = ({
  seed = ethers.ZeroAddress,
  size = 50,
}: {
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
        }}
        className={`shadow rounded-full border bg-background`}
        src={src}
        alt={`avatar ${name}`}
      />
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={`flex shadow border items-center justify-center font-semibold  rounded-full bg-info/5 uppercase`}
    >
      {name?.[0]}
      {name?.[1]}
    </div>
  );
};
