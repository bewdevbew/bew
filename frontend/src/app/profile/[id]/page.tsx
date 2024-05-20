"use client";

import { AvatarUnknow } from "@/components/common/profile/AvatarUnknow";
import { TextH } from "@/components/common/text/TextH";
import { ProfileAvatar } from "@/components/features/profile/ProfileAvatar";
import { TokenName } from "@/components/features/token/TokenName";
import { TokenNetworkView } from "@/components/features/token/TokenNetworkView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeaderCard } from "@/components/ui/header-card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/app";
import { useForm } from "@/context/form";
import { useContract } from "@/hooks/useContract";
import {
  ProgressBar,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";

import { ethers } from "ethers";

import { BrainCircuit, Coins, Network, Variable, Workflow } from "lucide-react";

import React, { ReactNode, useEffect, useState } from "react";

const PageProfile = ({ params }: { params: { id: string } }) => {
  const { data: profile, isLoading } = useAuth();
  console.log({ profile });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { post: postToken } = useContract("token");
  const { getValue, set } = useForm();
  const { toast } = useToast();

  const sendToken = async () => {
    const address = getValue("tokenDirection");
    let value = getValue("tokenValue");

    if (!ethers.isAddress(address)) {
      return toast({
        title: "Invalid address",
        description: "Please enter a valid address",
        variant: "destructive",
      });
    }
    if (!value) {
      return toast({
        title: "Invalid value",
        description: "Please enter a valid value",
        variant: "destructive",
      });
    }

    value = ethers.parseEther(value);

    await postToken("transfer", [address, value]);

    toast({
      title: "Token sent",
      description: "The token has been sent successfully !",
    });
  };

  return (
    <main className="flex p-10 gap-5 justify-center flex-1">
      <div className="flex flex-col gap-8">
        <Card>
          {profile?.token?.supply && profile?.token?.rules?.maxSupply && (
            <>
              <ProgressBar
                label={`${(
                  (Number(profile.token.supply) /
                    Number(ethers.formatEther(profile.token.rules.maxSupply))) *
                  100
                ).toFixed(2)}%`}
                className="w-full"
                value={
                  (Number(profile.token.supply) /
                    Number(ethers.formatEther(profile.token.rules.maxSupply))) *
                  100
                }
              />
            </>
          )}
          <TextH>{profile?.token?.name}</TextH>
          <p className="font-light">{profile?.token?.symbol}</p>
        </Card>
        <TokenNetworkView token={profile.token} />

        <Card
          header={{
            button: (
              <div className="flex bg-muted p-1 gap-2 rounded-lg shadow border ml-auto h-fit my-auto">
                <Button
                  variant={
                    getValue("tabs-expand-network") !== 1
                      ? "default"
                      : "outline"
                  }
                  onClick={() => set("tabs-expand-network", 0)}
                >
                  Wallet
                </Button>
                <Button
                  variant={
                    getValue("tabs-expand-network") === 1
                      ? "default"
                      : "outline"
                  }
                  onClick={() => set("tabs-expand-network", 1)}
                >
                  Network
                </Button>
              </div>
            ),
            title: <>Expand your network </>,
            icon: <Workflow />,
          }}
        >
          <div className="flex flex-col gap-4">
            <Input
              label={{ text: "New Network", icon: <Network /> }}
              target="tokenDirection"
              placeholder="Network address"
              required={ethers.isAddress(getValue("tokenDirection"))}
            />
            <Input
              label={{
                text: `${profile.token.name} Amount`,
                icon: <Variable />,
              }}
              target="tokenValue"
              placeholder={`Send ${profile.token.symbol}`}
              required={getValue("tokenValue") > 0}
              step={0.1}
              max={profile.token.balance}
            />
            <Button onClick={sendToken} variant={"default"}>
              Send {getValue("tokenValue") || 0} {profile.token.symbol}
            </Button>
          </div>
        </Card>
      </div>
      <Card className="overflow-visible flex flex-col gap-3">
        <HeaderCard icon={<BrainCircuit />}>
          Legacy
          <Badge className="ml-4">{profile?.token?.legacy}</Badge>
        </HeaderCard>
        {profile?.token?.events?.newTokenOnboarded?.map(
          (el, i) =>
            el.token !== profile.token.address && (
              <div
                key={`token-onboarded-${i}`}
                className="border p-3 rounded-lg flex gap-10 items-center"
              >
                <ProfileAvatar address={el.to} />
                <TokenName symbol address={el.token} />
              </div>
            )
        )}
        <Button variant={"default"} className="mt-4 text-lg">
          Create new token
        </Button>
      </Card>
    </main>
  );
};

export default PageProfile;
