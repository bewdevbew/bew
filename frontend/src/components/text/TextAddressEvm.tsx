import { ethers } from "ethers";
import React from "react";

export const TextAddressEvm = ({
  children,
  className,
}: {
  children: ethers.AddressLike;
  className?: string;
}) => {
  children = children as string;
  // return 0x + 4 characters + ... + 4 characters
  return (
    <span className={className}>
      {children.slice(0, 6)}
      ...
      {children.slice(-4)}
    </span>
  );
};
