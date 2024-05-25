"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { ConnectKitButton } from "connectkit";
import { APP } from "@/constants/app";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";
import { Modal } from "@/components/ui/alert-dialog";
import {
  Profile,
  profileId,
  useLogin,
  useProfilesManaged,
  useSession,
} from "@lens-protocol/react-web";
import { Card } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/features/profile/ProfileAvatar";
import { useToast } from "@/components/ui/use-toast";
import { ProfileName } from "@/components/features/profile/ProfileName";

export function Header() {
  const pathname = usePathname();

  const {
    execute: login,
    data: profile,
    loading: isLoginPending,
    error,
  } = useLogin();

  const { address } = useAccount();
  const { data: profiles } = useProfilesManaged({
    for: address as string,
    includeOwned: true,
  });

  const { data: lensSession } = useSession();

  console.log({ lensSession });
  const { toast } = useToast();
  const onSubmit = async (profile: Profile) => {
    if (!address)
      return toast({
        title: "Error Wallet Provider",
        description: "Must connect to your wallet first",
        variant: "destructive",
      });
    const id = profileId(profile.id);
    const result = await login({ address: address as string, profileId: id });
    if (result.isSuccess()) {
      return toast({
        title: "Connection success",
        description: `Welcome ${result.value?.metadata?.displayName}`,
      });
    }
    toast({
      title: "Connection failed",
      variant: "destructive",
      description: (result as any).error.message,
    });
  };

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

        {lensSession?.authenticated ? (
          <Button className="flex items-center gap-3 justify-center py-3">
            <ProfileAvatar size={40} profile={(lensSession as any).profile} />
            <ProfileName profile={(lensSession as any).profile} />
          </Button>
        ) : (
          <Modal
            trigger={"Lens Profile"}
            title={"Connectez vous à votre profile"}
          >
            <div className=" flex flex-col items-center">
              <div className="my-4 flex items-center justify-center">
                {!profiles ? (
                  <Loader2 />
                ) : (
                  profiles?.map((profile, idx) => (
                    <Card key={profile.id} className="p-5 " width={"w-[300px]"}>
                      <div className="flex flex-col w-full items-center">
                        <b className="text-info">
                          {profile.metadata?.displayName}{" "}
                        </b>
                        <span className="opacity-50">
                          {profile.handle?.fullHandle ?? profile.id}
                        </span>
                        <br />
                        <ProfileAvatar
                          showBadge
                          showTooltip
                          profile={profile}
                        />
                        <span>{profile?.metadata?.bio}</span>
                        <br />
                        <Button
                          onClick={() => onSubmit(profile)}
                          className="w-full"
                        >
                          Login
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
              <label className="text-base text-gray-500 ">
                Select a Lens Profile to login with.
              </label>
            </div>
          </Modal>
        )}
        <ConnectKitButton />
      </div>
    </header>
  );
}
