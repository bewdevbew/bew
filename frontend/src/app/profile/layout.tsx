"use client";
import { ProfileAvatar } from "@/components/features/profile/ProfileAvatar";
import { ProfileName } from "@/components/features/profile/ProfileName";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/app";
import { useProfile } from "@/hooks/useApp";
import { cn } from "@/utils/ui";
import {
  Badge,
  BrickWall,
  LayoutDashboard,
  LogOut,
  NotebookPen,
  ScanFace,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params: { address: `0x${string}` } = useParams();
  const { data: profile } = useProfile({ address: params.address });
  const address = params.address;

  const [url, setUrl] = useState<string | false>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.pathname);
    }
  }, [window?.location?.pathname]);

  return (
    <main className="w-screen h-full flex gap-10 p-10 ">
      <Card padding="p-0 pt-8 pb-12" className="relative h-1/2 rounded-[15%]">
        <div className="absolute top-1/2 w-full p-[1px] border left-0" />
        <div className="px-10 relative flex flex-col gap-4">
          <div className="gap-4 font-medium text-2xl flex items-center">
            <ProfileAvatar
              color={2}
              size={60}
              profile={profile?.lens}
              address={params.address}
            />

            <ProfileName profile={(profile?.lens || address) as any} />
          </div>
          <Card padding="px-10 py-5" className="gap-10">
            <p className=" text-muted-foreground">
              {profile?.lens?.handle?.fullHandle || "Menu"}
            </p>
            <div className="flex flex-col gap-2 text-lg">
              {[
                {
                  name: "Dashboard",
                  href: `/profile/${address}`,
                  icon: <LayoutDashboard />,
                },
                {
                  name: "Manage tokens",
                  href: `/profile/${address}`,
                  icon: <Badge />,
                },
                {
                  name: "Social",
                  href: `/profile/${address}/social`,
                  icon: <ScanFace />,
                },
                {
                  name: "Wall",
                  href: `/profile/${address}`,
                  icon: <BrickWall />,
                },
              ].map((el, i) => (
                <Link
                  href={el.href}
                  key={`menu-layout-profile-${i}`}
                  className={cn(
                    "flex hover:text-info items-center gap-4 text-muted-foreground text-xl",
                    el.href === url && "text-info"
                  )}
                >
                  {el.icon}
                  <span className="font-medium text-xl">{el.name}</span>
                </Link>
              ))}
              <a className="flex mt-8 hover:text-destructive items-center gap-4 text-muted-foreground text-xl ">
                <LogOut className="text-destructive" />
                <span className="font-medium text-xl">Logout</span>
              </a>
            </div>
          </Card>
        </div>
      </Card>
      <>{children}</>
    </main>
  );
}
