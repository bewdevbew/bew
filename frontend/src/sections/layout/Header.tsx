import { APP } from "@/constants/app";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import React from "react";

export const Header = () => {
  return (
    <header className="w-screen flex items-center p-10">
      <Link className="mr-auto" href={"/"}>
        {APP.name}
      </Link>
      <ConnectKitButton />
    </header>
  );
};
