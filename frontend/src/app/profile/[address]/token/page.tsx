"use client";

import { TextH } from "@/components/common/text/TextH";
import { ProfileAvatar } from "@/components/features/profile/ProfileAvatar";
import { ProfileName } from "@/components/features/profile/ProfileName";
import { TokenName } from "@/components/features/token/TokenName";
import { TokenNetworkView } from "@/components/features/token/TokenNetworkView";
import { AnimatedList } from "@/components/ui/animated-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Notification } from "@/components/ui/notification";

import { useToast } from "@/components/ui/use-toast";
import { IcGithub } from "@/constants/icon";
import { useAuth } from "@/context/app";
import { useForm } from "@/context/form";
import { useApi } from "@/hooks/useApi";
import { useProfile } from "@/hooks/useApp";
import { useContract } from "@/hooks/useContract";
import { calculateTokenDominance } from "@/utils/contract";
import { castLensAttributes } from "@/utils/lens";
import { cn } from "@/utils/ui";
import { formatNumber } from "@/utils/ux";
import { useLastLoggedInProfile } from "@lens-protocol/react-web";
import { Callout, DonutChart, Legend, ProgressBar } from "@tremor/react";

import { ethers } from "ethers";

import {
  BadgeCheck,
  BadgeMinus,
  BrainCircuit,
  Crown,
  Globe,
  Hash,
  MapPinned,
  Network,
  ShieldCheck,
  Variable,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { Fragment, useRef } from "react";
import { useAccount } from "wagmi";

const PageProfileToken = ({
  params,
}: {
  params: { address: `0x${string}` };
}) => {
  const { data: session, isLoading } = useAuth();
  console.log({ session });

  const { post: postToken, ...rest } = useContract("token");
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

  const {
    data: { lens, token },
  } = useProfile({ address: params.address });

  // const { data: lens } = useLastLoggedInProfile({ for: params.address });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const attributes = castLensAttributes(lens);

  const { rules } = token || { rules: undefined };

  const dominances = calculateTokenDominance(token);

  console.log({ session, dominances, lens, token, attributes });
  return (
    <div className="flex p-10 gap-5 justify-center flex-1">
      <div className="flex flex-col gap-8">
        {session.token?.address === token?.address && (
          <Card
            layoutId="card-profile-expand-network"
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
                  text: `${session.token?.name} Amount`,
                  icon: <Variable />,
                }}
                target="tokenValue"
                placeholder={`Send ${session.token?.symbol}`}
                required={getValue("tokenValue") > 0}
                step={0.1}
                max={session.token?.balance}
              />

              {!!getValue("tokenValue") && (
                <Callout
                  className="whitespace-wrap w-[400px]"
                  title="Transaction"
                  color={
                    getValue("tabs-expand-network") !== 1 ? "red" : "green"
                  }
                >
                  En envoyant des tokens :
                  <br />
                  <div className="">
                    <ul className="list-disc italic list-outside">
                      {
                        [
                          <>
                            <li>
                              Vous acceptez d'envoyer vos tokens au wallet d'un
                              utilisateur
                            </li>
                            <li>Vous renoncez à la propriété de vos tokens</li>
                            <li>
                              Vous étendez la décentralisation de votre token
                            </li>
                            <li>
                              Vous offrez le contenu exclusif lié à votre token
                            </li>
                          </>,
                          <>
                            <li>
                              Vous acceptez de mettre en commun vos tokens de
                              réputation avec un autre Network.
                            </li>
                            <li>
                              Vous consentez à ce que le Network puisse utiliser
                              vos tokens
                            </li>
                            <li>
                              Vous êtes capable de retirer votre engagement à
                              tout moment
                            </li>
                            <li>
                              Vous pouvez profiter des contenus exclusif offert
                              par le Network
                            </li>
                          </>,
                        ][getValue("tabs-expand-network") || 0]
                      }
                    </ul>
                  </div>
                  <br />
                  <br />
                  N'oubliez pas que vous devez conserver 51% de vos tokens pour
                  pouvoir rester l'administrateur de ce réseau.
                </Callout>
              )}

              <Button onClick={sendToken} variant={"default"}>
                Send {getValue("tokenValue") || 0} {session.token?.symbol}
              </Button>
            </div>
          </Card>
        )}
        <Card
          layoutId="card-profile-strengthens-network"
          header={{
            title: (
              <>
                Strengthens {token?.name || "Network"} <br />& Commit your
                reputation
              </>
            ),
            icon: <Workflow />,
          }}
        >
          <div className="flex flex-col gap-4">
            <Input
              label={{
                text: `${session.token?.name} Amount`,
                icon: <Variable />,
              }}
              target="tokenReputationValue"
              placeholder={`Send ${session.token?.symbol}`}
              required={getValue("tokenReputationValue") > 0}
              step={0.1}
              max={session.token?.balance}
            />

            {!!getValue("tokenReputationValue") && (
              <Callout
                className="whitespace-wrap w-[400px]"
                title="Transaction"
                color={"red"}
              >
                En envoyant vos tokens :
                <br />
                <div className="">
                  <ul className="list-disc italic list-outside">
                    {
                      [
                        <>
                          <li>
                            Vous acceptez d'envoyer vos tokens au wallet d'un
                            utilisateur
                          </li>
                          <li>Vous renoncez à la propriété de vos tokens</li>
                          <li>
                            Vous étendez la décentralisation de votre token
                          </li>
                          <li>
                            Vous offrez le contenu exclusif lié à votre token
                          </li>
                        </>,
                        <>
                          <li>
                            Vous acceptez de mettre en commun vos tokens de
                            réputation avec un autre Network.
                          </li>
                          <li>
                            Vous consentez à ce que le Network puisse utiliser
                            vos tokens
                          </li>
                          <li>
                            Vous êtes capable de retirer votre engagement à tout
                            moment
                          </li>
                          <li>
                            Vous pouvez profiter des contenus exclusif offert
                            par le Network
                          </li>
                        </>,
                      ][token?.address === session?.token?.address ? 0 : 1]
                    }
                  </ul>
                </div>
                <br />
                <br />
                N'oubliez pas que vous devez conserver 51% de vos tokens pour
                pouvoir rester l'administrateur de ce réseau.
              </Callout>
            )}

            <Button
              onClick={async () => {
                const value = ethers.parseEther(
                  getValue("tokenReputationValue")
                );
                if (!value) {
                  return toast({
                    title: "Invalid value",
                    description: "Please enter a valid value",
                    variant: "destructive",
                  });
                } else if (value > ethers.parseEther(session.token?.balance)) {
                  return toast({
                    title: "Insufficient balance",
                    description: "You don't have enough balance",
                    variant: "destructive",
                  });
                }
                await postToken("transferOnPoolReputation", [
                  session.token?.address,
                  value,
                ]);
                toast({
                  title: "Token sent",
                  description: "The token has been sent successfully !",
                });
              }}
              variant={"default"}
            >
              Send {getValue("tokenReputationValue") || 0}{" "}
              {session.token?.symbol}
            </Button>
          </div>
        </Card>
      </div>
      <div className="flex flex-col gap-8"></div>
    </div>
  );
};

export default PageProfileToken;
