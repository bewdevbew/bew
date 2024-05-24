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

const PageProfile = ({ params }: { params: { address: `0x${string}` } }) => {
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
        <Card layoutId="card-profile-supply">
          {token?.supply && rules?.maxSupply && (
            <>
              <ProgressBar
                label={`${(
                  (Number(token?.supply) / Number(rules?.maxSupply)) *
                  100
                ).toFixed(2)}%`}
                className="w-full"
                value={(Number(token?.supply) / Number(rules?.maxSupply)) * 100}
              />
            </>
          )}
          <TextH>{token?.name}</TextH>
          <p className="font-light">{token?.symbol}</p>
        </Card>
        <TokenNetworkView token={{ ...token, rules }} />

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
      <div className="flex flex-col gap-8">
        <div className="flex gap-4">
          {token?.interaction && (
            <Card
              header={{
                title: "Relation with my Network",
                icon: <ShieldCheck />,
              }}
              className="w-fit min-w-[100px] items-center gap-5"
            >
              {[
                {
                  value: token?.interaction?.peer?.balanceAdmin,
                  label: (
                    <>
                      Wallet <ProfileName profile={lens || token?.admin} />
                    </>
                  ),
                  time: session?.token?.symbol,
                },
                {
                  value: token?.interaction?.peer?.balanceGovernance,
                  label: "Governance Balance ",
                  time: token?.symbol,
                },
                {
                  value: token?.interaction?.peer?.balanceSponsorByAdmin,
                  label: `Balance Network`,
                  time: token?.symbol,
                },
                {
                  value: token?.interaction?.peer?.balanceSponsorByToken,
                  label: `Balance ${token?.symbol} (on network)`,
                  time: session?.token?.symbol,
                },
                {
                  value: token?.interaction?.peer?.balanceReputation,
                  label: `Balance Reputation ${token?.symbol}`,
                  time: token?.symbol,
                },
                {
                  value: token?.interaction?.peer?.balanceToken,
                  label: `Balance ${token?.symbol} (out network)`,
                  time: session?.token?.symbol,
                },
              ].map((el, i) => (
                <Notification
                  key={i}
                  time={el.time}
                  icon={
                    {
                      [session.token.symbol]: (
                        <ProfileAvatar
                          size={30}
                          address={session?.token?.admin}
                          profile={session?.lens}
                        />
                      ),

                      [token.symbol]: (
                        <ProfileAvatar
                          size={30}
                          address={token?.admin}
                          profile={lens}
                        />
                      ),
                    }[el.time]
                  }
                  description={el.label}
                  name={<>{formatNumber(el.value as any)}</>}
                />
              ))}
              {/* <DonutChart
                data={}
                category="value"
                index="label"
                valueFormatter={() =>
                  `% ${dominances.admin + dominances.network}`
                }
                colors={["green", "cyan", "red"]}
                className="w-40"
              /> */}
              <Legend
                categories={["Admin", "Network", "Others"]}
                colors={["green", "cyan", "red"]}
                className="max-w-xs"
              />
            </Card>
          )}
          <Card
            header={{ title: "Admin dominance", icon: <ShieldCheck /> }}
            className="w-fit min-w-[100px] items-center gap-5"
          >
            <DonutChart
              data={[
                {
                  value: dominances.admin,
                  label: "Admin",
                },
                {
                  value: dominances.network,
                  label: "Network",
                },
                {
                  value: 100 - dominances.admin - dominances.network,
                  label: "Others",
                },
              ]}
              category="value"
              index="label"
              valueFormatter={() =>
                `% ${dominances.admin + dominances.network}`
              }
              colors={["green", "cyan", "red"]}
              className="w-40"
            />
            <Legend
              categories={["Admin", "Network", "Others"]}
              colors={["green", "cyan", "red"]}
              className="max-w-xs"
            />
          </Card>
        </div>

        <Card
          layoutId="card-profile-lens"
          header={{
            title: "Lens Protocole",
            icon: (
              <img
                src="/lens-logo.jpeg"
                className="rounded-full shadow border"
                style={{ width: 50, height: 50 }}
              />
            ),
          }}
        >
          <ProfileName profile={(lens || params.address) as any} showHandle />
          {lens && (
            <>
              <p className="font-light ">
                {lens?.metadata?.bio || "No bio available"}
              </p>
              <div className="flex gap-5">
                {[
                  {
                    value: lens?.stats?.followers,
                    label: "Followers",
                  },
                  {
                    value: lens?.stats?.following,
                    label: "Following",
                  },
                  {
                    value: lens?.globalStats?.lensClassifierScore,
                    label: "Lens Score",
                    className: "text-fuchsia-800",
                  },
                ].map((el, i) => (
                  <div
                    key={`lens-info-follow-${i}`}
                    className={cn("flex flex-col", el?.className)}
                  >
                    <span className="font-extrabold text-xl">{el.value}</span>
                    <p className="text-sm text-muted-foreground font-semibold">
                      {el.label}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
          <>
            <div className="mt-10 opacity-80 flex flex-col  gap-3 text-xs">
              <div className="flex items-center gap-3">
                <Hash />
                {lens?.id}
              </div>
              {attributes?.location && (
                <div className="flex items-center gap-3">
                  <MapPinned />
                  {attributes?.location}
                </div>
              )}
              {attributes?.github && (
                <div className="flex items-center gap-3">
                  <IcGithub />
                  {attributes?.github}
                </div>
              )}
              {attributes?.website && (
                <div className="flex items-center gap-3">
                  <Globe />
                  <a
                    className="cursor-pointer hover:text-info"
                    onClick={() => window.open(attributes?.website, "_blank")}
                  >
                    {attributes?.website}
                  </a>
                </div>
              )}

              {attributes?.role && (
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user"
                  >
                    <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.5 10-10 10s-10-4.48-10-10a10 10 0 0 1 10-10z" />
                    <path d="M8 15s1-2 4-2 4 2 4 2" />
                  </svg>
                  {attributes?.role}
                </div>
              )}
            </div>

            <div className="flex max-w-[300px] mt-10  flex-wrap gap-2">
              {lens?.interests?.map((el, i) => (
                <div
                  className="p-2 border-primary text-center border text-xs  rounded-full"
                  key={`interest-${i}`}
                >
                  {el.replace(/_/g, " ").toLowerCase()}
                </div>
              ))}
            </div>
          </>
        </Card>

        <Card
          layoutId="card-profile-token-rules"
          header={{
            title: "Rules",
            icon: <Crown />,
          }}
          className="overflow-visible flex flex-col gap-3"
        >
          <Notification
            color={1}
            name="Total Supply"
            icon="🏦"
            description={`${token?.symbol} ${formatNumber(
              token?.supply
            ).toString()}`}
            className="border p-3 rounded-lg flex gap-10 items-center"
            time="15m ago"
          />
          <Notification
            color={1}
            name="Admin Legacy fee"
            icon="👶"
            description={`${Number(rules?.adminLegacyFeePercentage)}%`}
            className="border p-3 rounded-lg flex gap-10 items-center"
            time="15m ago"
          />
          <Notification
            color={2}
            name="Admin Mint fee"
            icon="👑"
            description={`${Number(rules?.adminRetainedTokensPercentage)}%`}
            className="border p-3 rounded-lg flex gap-10 items-center"
            time="15m ago"
          />
          <Notification
            color={3}
            name="Network Participation fee"
            icon="💎"
            description={`${Number(rules?.networkParticipationPercentage)}%`}
            className="border p-3 rounded-lg flex gap-10 items-center"
            time="15m ago"
          />
          <Notification
            color={4}
            name="Admin Revocation fee"
            icon="🛜"
            description={`${Number(rules?.adminRevokeFeePercentage)}%`}
            className="border p-3 rounded-lg flex gap-10 items-center"
            time="15m ago"
          />
          <Notification
            color={5}
            name="Network Sub fee"
            icon="🎁"
            description={`${Number(
              rules?.networkToChildAllocationPercentage
            )}%`}
            className="border p-3 rounded-lg flex gap-10 items-center"
            time="15m ago"
          />
        </Card>

        <AnimatedList
          header={{
            title: (
              <>
                Legacy
                <Badge className="ml-4">{token?.legacy}</Badge>
              </>
            ),

            icon: <BrainCircuit />,
          }}
          notifications={token?.events?.newTokenOnboarded?.map((el, i) => ({
            description: (
              <>
                <TokenName address={el.token} />
              </>
            ),

            avatar: (
              <Link href={`/profile/${el.to}`}>
                <ProfileAvatar color={i} size={50} address={el.to} />
              </Link>
            ),
            name: "New token onboarded",
            time: "15m ago",
            color: i,
          }))}
        >
          <Button
            href="/create/token"
            variant={"default"}
            className="mt-auto text-lg"
          >
            Create new token
          </Button>
        </AnimatedList>
      </div>
    </div>
  );
};

export default PageProfile;
