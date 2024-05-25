"use client";
import { ProfileAvatar } from "@/components/features/profile/ProfileAvatar";
import { ProfileName } from "@/components/features/profile/ProfileName";
import { Card } from "@/components/ui/card";

import { useProfile } from "@/hooks/useApp";
import { cn } from "@/utils/ui";
import {
  Badge,
  BrickWall,
  Diamond,
  LayoutDashboard,
  LogOut,
  ScanFace,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params: { address: `0x${string}` } = useParams();

  const { data: profile } = useProfile({ address: params.address });
  const address = params.address;

  const pathname = usePathname();

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
          <div className="px-10 flex flex-col bg-background rounded-2xl shadow-2xl border py-5 gap-10">
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
                  href: `/profile/${address}/token`,
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
                {
                  name: "Peer",
                  href: `/profile/${address}/peer`,
                  icon: <Diamond />,
                },
              ].map((el, i) => (
                <Link
                  href={el.href}
                  key={`menu-layout-profile-${i}`}
                  className={cn(
                    "flex hover:text-info items-center gap-4 text-muted-foreground text-xl",
                    el.href === pathname && "text-info"
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
          </div>
        </div>
      </Card>
      <>{children}</>
    </main>
  );
}
