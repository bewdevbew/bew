"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { ConnectKitButton } from "connectkit";
import { APP } from "@/constants/app";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { address } = useAccount();

  return (
    <header
      style={{ zIndex: 100 }}
      className=" py-4
    border-b flex
    flex-col sm:flex-row
    items-start sm:items-center
    sm:pr-10 bg-background
    "
    >
      <div className="py-3 px-8 flex flex-1 items-center p">
        <Link href="/" className="mr-5 flex items-end text-primary">
          <p className={`  text-xl font-bold leading-none lowercase`}>
            {APP.name}
          </p>
          <span className="pt-[1.3px] w-6 bg-primary"></span>
        </Link>
        <div className="ml-10 flex items-center gap-10">
          {[
            { href: "/", label: "Home" },
            { href: "/protocol-test", label: "Protocol" },
            { href: "/social", label: "Social" },
            { href: "/create/token", label: "Create" },
            { href: "/playground", label: "Playground" },
            address && { href: `/profile/${address}`, label: "Profile" },
          ].map(
            (el, i) =>
              el?.href && (
                <Link
                  href={el?.href}
                  key={"header-link-" + i}
                  className={` ${
                    pathname === el?.href ? "underline" : "opacity-50"
                  }  text-sm font-bold`}
                >
                  <p>{el?.label}</p>
                </Link>
              )
          )}
        </div>
      </div>
      <div
        className="
        flex
        sm:items-center
        pl-8 gap-4 pb-3 sm:p-0
      "
      >
        <Button href="/social/message">
          <Mail />
        </Button>
        <ConnectKitButton />
      </div>
    </header>
  );
}
