"use client";
import { Logo } from "@/components/assets/Logo";

import { TextH } from "@/components/common/text/TextH";
import { TextLabel } from "@/components/common/text/TextLabel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEW_STANDARD } from "@/config/standard";

import {
  Baseline,
  CircleUser,
  HandCoins,
  LineChart,
  Lollipop,
  Pilcrow,
  TestTubeDiagonal,
  TrendingUp,
  Wand,
} from "lucide-react";
import React from "react";
import {
  CategoryBar,
  Legend,
  ProgressBar,
  ProgressCircle,
} from "@tremor/react";
import {
  calculateDecentralizationScore,
  calculateOnboardToken,
  calculateRiskChildScore,
  calculateRiskNetworkScore,
} from "@/utils/contract";
import { useForm } from "@/context/form";
import { CardStandardBeam } from "@/components/features/token/docs/CardStandardToken";
import { cn, getForkedColor } from "@/utils/ui";
import { useAuth } from "@/context/app";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { useContract } from "@/hooks/useContract";

export const getTremorColor = (value: number, to: 0 | 1) => {
  let color = "";
  const colorTarget = [200, 400, 600, 700];
  let i: number = 0;

  // plus value est proche de 40 plus i = 0 est proche de 60 plus i = 3
  if (value > 40 || value < 60) {
    color = "yellow";
    if (to === 0) {
      i = Math.round(((60 - value) / 20) * (colorTarget.length - 1));
    } else {
      i = Math.round(((value - 40) / 20) * (colorTarget.length - 1));
    }
  }
  if (value >= 60) {
    color = to === 0 ? "red" : "green";
    i = Math.round(((value - 60) / 40) * (colorTarget.length - 1));
  } else if (value <= 40) {
    color = to === 0 ? "green" : "red";
    i = Math.round(((40 - value) / 40) * (colorTarget.length - 1));
  }

  return `${color}-${colorTarget[i]}`;
};

export default () => {
  // const {set, get} = useForm

  const {
    data: { token },
    isLoading,
  } = useAuth();
  const { toast } = useToast();

  const { set, get, getValue } = useForm();

  const standard: keyof typeof DEW_STANDARD =
    getValue("standard") || "explorer";

  const standardObject = {
    adminRetainedTokensPercentage: !!getValue("admin")
      ? getValue("admin")
      : DEW_STANDARD[standard].adminRetainedTokensPercentage,
    networkParticipationPercentage: !!getValue("networkParticipation")
      ? getValue("networkParticipation")
      : DEW_STANDARD[standard].networkParticipationPercentage,
    networkToChildAllocationPercentage: !!getValue("networkParticipation")
      ? getValue("networkAllocation")
      : DEW_STANDARD[standard].networkToChildAllocationPercentage,
  };

  const risks = {
    network: calculateRiskNetworkScore(standardObject),
    child: calculateRiskChildScore(standardObject),
    decentralisation: calculateDecentralizationScore(standardObject),
  };

  const { post } = useContract("token");

  const createToken = async () => {
    const {
      name,
      initialSupply,
      maxSupply,
      symbol,
      addressEVM,
      description,
      admin,
      networkParticipation,
      networkAllocation,
    } = get();

    console.log({
      name,
      symbol,
      addressEVM,
      description,
      admin,
      networkParticipation,
      networkAllocation,
    });

    if (!ethers.isAddress(addressEVM)) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid address",
        variant: "destructive",
      });
      throw new Error("Invalid address");
    } else if (!name || !symbol) {
      toast({
        title: "Missing fields",
        description: "Please enter a name and a symbol",
        variant: "destructive",
      });
      throw new Error("Invalid args");
    }

    const tx = await post("onboardParticipant", [addressEVM, name, symbol]);

    toast({
      title: "Token created",
      description: "Your token has been created",
    });
  };

  console.log({ testtoken: token, isLoading });
  if (isLoading || token?.address === "0x") {
    return <div>Loading...</div>;
  }

  const { networkMint, restNetworkSupply, toNetwork, toAdmin, toChildNetwork } =
    calculateOnboardToken({
      networkParticipationPercentage:
        token.rules.networkParticipationPercentage,
      networkToChildAllocationPercentage:
        token.rules.networkToChildAllocationPercentage,
      adminRetainedTokensPercentage: token.rules.adminRetainedTokensPercentage,
      childSupply: token.rules.initialSupply,
      networkSupply: token.supply,
      networkMaxSupply: token.rules.maxSupply,
    });

  console.log({
    networkMint,
    restNetworkSupply,
    token,
    toNetwork,
    toAdmin,
    toChildNetwork,
  });
  return (
    <main className="w-screen h-full flex  justify-center gap-10">
      <Card padding="p-0" className="w-[1500px]">
        <div className="p-10 bg-zinc-100">
          <div className="flex gap-10 items-center">
            <Logo size={44} />
            <div className="flex flex-col">
              <TextH>Create New Token</TextH>
            </div>

            <Badge
              variant={token.name ? "default" : "destructive"}
              className="ml-auto text-sm"
            >
              {token.name
                ? `Hello ${token.name} !`
                : "Give me your token reputation"}
            </Badge>
          </div>

          <div className="flex gap-10 items-center mt-5">
            <Button>Project</Button>
            <Button>Network</Button>
            <Button>Customer</Button>
            <Button>Default</Button>
          </div>
        </div>
        <div className="w-full flex flex-col gap-10 border-t p-10">
          <div className="flex flex-col gap-4">
            <TextLabel icon={<TestTubeDiagonal />}>Token Settings</TextLabel>
            <div className="flex gap-3 overflow-x-scroll scrollbar-thin">
              {Object.entries(DEW_STANDARD).map((el, i, arr) => (
                <div
                  key={`standard-beam-${i}`}
                  onClick={() => set("standard", arr[i][0])}
                  className=" flex "
                >
                  <CardStandardBeam target={el[0] as any} />
                </div>
              ))}
            </div>
          </div>
          <Input
            required={!!!ethers.isAddress(getValue("addressEVM"))}
            target="addressEVM"
            label={{
              text: "Address EVM",
              icon: <CircleUser />,
            }}
            placeholder="0x"
          />
          <Input
            target="name"
            label={{
              text: "Token Name",
              icon: <Baseline />,
            }}
            placeholder="ZeroDay"
          />
          <Input
            target="symbol"
            label={{
              text: "Token Symbol",
              icon: <Pilcrow />,
            }}
            placeholder="0DAY"
          />

          <Textarea
            label={{ text: "Description", icon: <Lollipop /> }}
            placeholder="Description of token"
          />

          <div className="flex flex-col gap-4 w-full">
            <TextLabel icon={<Wand />}>Custom rules</TextLabel>

            <div className="flex items-center w-full gap-10">
              <Input
                target="admin"
                type="number"
                className="w-full"
                value={Number(token?.rules?.adminRetainedTokensPercentage)}
                max={49}
                placeholder="Admin Retained Tokens"
              />
              <Input
                target="networkParticipation"
                type="number"
                value={Number(token?.rules?.networkParticipationPercentage)}
                className="w-full"
                max={100}
                placeholder="Network Participation"
              />
              <Input
                target="networkAllocation"
                value={Number(token?.rules?.networkParticipationPercentage)}
                type="number"
                max={100}
                className="w-full"
                placeholder="Network Allocation"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <TextLabel icon={<HandCoins />}>Mint supply</TextLabel>

            <div className="flex items-center w-full gap-10">
              <Input
                target="initialSupply"
                type="number"
                className="w-full"
                value={token?.rules?.initialSupply || "0"}
                placeholder="Initial Supply"
              />
              <Input
                target="maxSupply"
                type="number"
                value={token?.rules?.maxSupply || "0"}
                className="w-full"
                placeholder="Max Supply"
              />
            </div>
          </div>

          <Button variant="default" className="ml-auto" onClick={createToken}>
            Create Token
          </Button>
        </div>
      </Card>
      <div className="space-y-10">
        <div className="space-y-3">
          <div className="text-center font-mono text-sm text-slate-500">
            Score <Badge variant="outline">Bêta</Badge>
          </div>
          <Card className="mx-auto max-w-sm">
            <div className="flex justify-start space-x-5 items-center">
              <ProgressCircle
                color={getTremorColor(risks.network, 0)}
                value={risks.network}
                size="md"
              >
                <span className="text-xs font-medium text-slate-700">
                  {risks.network}%
                </span>
              </ProgressCircle>
              <div>
                <p className="text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
                  {(Number(token?.rules?.initialSupply) *
                    Number(token?.rules?.adminRetainedTokensPercentage)) /
                    100}{" "}
                  {getValue("name")} ({risks.network}
                  %)
                </p>
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  Risk Score {token.name}
                </p>
              </div>
            </div>
          </Card>
          <Card className="mx-auto max-w-sm">
            <div className="flex justify-start space-x-5 items-center">
              <ProgressCircle
                color={getTremorColor(risks.child, 0)}
                value={risks.child}
                size="md"
              >
                <span className="text-xs font-medium text-slate-700">
                  {risks.child}%
                </span>
              </ProgressCircle>
              <div>
                <p className="text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
                  {token.rules.initialSupply} ChildToken ({risks.child}
                  %)
                </p>
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  Risk score ChildToken
                </p>
              </div>
            </div>
          </Card>
          <Card className="mx-auto max-w-sm">
            <div className="flex justify-start space-x-5 items-center">
              <ProgressCircle
                color={getTremorColor(risks.decentralisation, 1)}
                value={risks.decentralisation}
                size="md"
              >
                <span className="text-xs font-medium text-slate-700">
                  {risks.decentralisation}%
                </span>
              </ProgressCircle>
              <div>
                <p className="text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
                  {standard.toLocaleUpperCase()} ({risks.decentralisation}
                  %)
                </p>
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  Decentralisation score ChildToken
                </p>
              </div>
            </div>
          </Card>
        </div>
        <Card>
          {token?.supply && token?.rules?.maxSupply && (
            <>
              <div className="flex justify-end gap-2 items-end">
                <div className="flex flex-col text-end">
                  <p className="font-bold text-4xl"> + {networkMint}</p>
                  <p className="text-muted-foreground font-semibold text-xl">
                    {token.symbol} mint & send
                  </p>
                </div>
                <TrendingUp size={90} className="text-destructive mt-auto" />
              </div>
              <CategoryBar
                showLabels={false}
                // label={`${(
                //   (Number(token.supply) /
                //     Number((token.rules.maxSupply))) *
                //   100
                // ).toFixed(2)}%`}
                className="w-full"
                colors={["green", "blue", "yellow", "red"]}
                values={[
                  (Number(token.balance) / Number(token.rules.maxSupply)) * 100,
                  ((Number(token.supply) - Number(token.balance)) /
                    Number(token.rules.maxSupply)) *
                    100,
                  (Number(networkMint) / Number(token.rules.maxSupply)) * 100,
                  (Number(restNetworkSupply) / Number(token.rules.maxSupply)) *
                    100,
                ]}
              />
              <Legend
                colors={["green", "blue", "yellow", "red"]}
                categories={[
                  `Network ${(
                    (Number(token.balance) / Number(token.rules.maxSupply)) *
                    100
                  ).toFixed(2)}%`,
                  `Circulating ${(
                    ((Number(token.supply) - Number(token.balance)) /
                      Number(token.rules.maxSupply)) *
                    100
                  ).toFixed(2)}%`,
                  `Child ${(
                    (Number(networkMint) / Number(token.rules.maxSupply)) *
                    100
                  ).toFixed(2)}%`,
                  `Rest ${(
                    (Number(restNetworkSupply) /
                      Number(token.rules.maxSupply)) *
                    100
                  ).toFixed(2)}%`,
                ]}
              />
            </>
          )}
        </Card>
        <Card>
          {token?.supply && token?.rules?.maxSupply && (
            <>
              <div className="flex justify-end gap-2 items-end">
                <div className="flex flex-col text-end">
                  <p className="font-bold text-4xl">
                    + {Number(toAdmin) + Number(toChildNetwork)}
                  </p>
                  <p className="text-muted-foreground font-semibold text-xl">
                    {getValue("symbol") || getValue("name") || "New token"} mint
                    & send
                  </p>
                </div>
                <TrendingUp size={90} className="text-success mt-auto" />
              </div>
              <CategoryBar
                showLabels={false}
                className="w-full"
                colors={["green", "blue", "yellow", "fuchsia"]}
                values={[
                  (Number(toNetwork) / Number(token.rules.maxSupply)) * 100,
                  (Number(toAdmin) / Number(token.rules.maxSupply)) * 100,
                  (Number(toChildNetwork) / Number(token.rules.maxSupply)) *
                    100,
                  ((Number(token.rules.maxSupply) -
                    (Number(toAdmin) +
                      Number(toNetwork) +
                      Number(toChildNetwork))) /
                    Number(token.rules.maxSupply)) *
                    100,
                ]}
              />
              <Legend
                colors={["green", "blue", "yellow", "fuchsia"]}
                categories={[
                  `Network ${(
                    (Number(toNetwork) / Number(token.rules.maxSupply)) *
                    100
                  ).toFixed(2)}%`,
                  `Admin ${(
                    (Number(toAdmin) / Number(token.rules.maxSupply)) *
                    100
                  ).toFixed(2)}%`,
                  `Child ${(
                    (Number(toChildNetwork) / Number(token.rules.maxSupply)) *
                    100
                  ).toFixed(2)}%`,
                  `Rest ${(
                    ((Number(token.rules.maxSupply) -
                      (Number(toAdmin) +
                        Number(toNetwork) +
                        Number(toChildNetwork))) /
                      Number(token.rules.maxSupply)) *
                    100
                  ).toFixed(2)}%`,
                ]}
              />
            </>
          )}
        </Card>
        <Card padding="p-0">
          <div className=" bg-muted w-full p-5 ">
            <TextH>New Token</TextH>
            <span className="font-light text-muted-foreground text-sm">
              Network: {token.name}
            </span>
          </div>
          <div className="px-5  divide-y">
            {[
              {
                label: "Identity",
                values: [
                  {
                    label: "Name",
                    value: getValue("name"),
                  },
                  {
                    label: "Symbol",
                    value: getValue("symbol"),
                  },
                  {
                    label: "Owner",
                    value: getValue("addressEVM"),
                  },
                ],
              },
              {
                label: "Supply",
                values: [
                  {
                    label: "Initial supply",
                    value:
                      getValue("initialSupply") || token.rules.initialSupply,
                  },
                  {
                    label: "Max supply",
                    value: getValue("maxSupply") || token.rules.maxSupply,
                  },
                ],
              },
              {
                label: "Transactions",
                values: [
                  {
                    label: "Balance of admin",
                    className: "text-green-700",
                    value: (
                      <>
                        +{" "}
                        {(((Number(token.rules.initialSupply) *
                          Number(token.rules.adminRetainedTokensPercentage)) /
                          100) *
                          Number(token.rules.networkParticipationPercentage)) /
                          100}{" "}
                        <LineChart />
                      </>
                    ),
                  },

                  {
                    label: `Balance of ${token.name || "Network"}`,
                    className: "text-green-700",
                    value: (
                      <>
                        +
                        {(Number(token.rules.initialSupply) *
                          Number(token.rules.adminRetainedTokensPercentage)) /
                          100 -
                          (((Number(token.rules.initialSupply) *
                            Number(token.rules.adminRetainedTokensPercentage)) /
                            100) *
                            Number(
                              token.rules.networkParticipationPercentage
                            )) /
                            100}
                        <LineChart />
                      </>
                    ),
                  },

                  {
                    label: "Balance of Child Network",
                    className: "text-green-700",
                    value: (
                      <>
                        +
                        {Number(token.rules.initialSupply) -
                          (Number(token.rules.initialSupply) *
                            Number(token.rules.adminRetainedTokensPercentage)) /
                            100}
                        <LineChart />
                      </>
                    ),
                  },
                  {
                    label: "Network allocation",
                    className: "text-red-700",
                    value: (
                      <>
                        -
                        {(((Number(token.rules.initialSupply) *
                          Number(token.rules.adminRetainedTokensPercentage)) /
                          100) *
                          Number(
                            token.rules.networkToChildAllocationPercentage
                          )) /
                          100}
                        <LineChart />
                      </>
                    ),
                  },
                ],
              },
              {
                label: "Rules",
                values: [
                  {
                    label: "Network fees",
                    value: (
                      <>{Number(token.rules.adminRetainedTokensPercentage)} %</>
                    ),
                  },

                  {
                    label: `Admin fees`,
                    value: (
                      <>
                        {100 -
                          Number(
                            token.rules.networkParticipationPercentage
                          )}{" "}
                        %
                      </>
                    ),
                  },
                  {
                    label: `Network participation`,
                    value: (
                      <>
                        {Number(token.rules.networkParticipationPercentage)} %
                      </>
                    ),
                  },
                  {
                    label: `Network mint`,
                    value: (
                      <>
                        {Number(token.rules.networkToChildAllocationPercentage)}{" "}
                        %
                      </>
                    ),
                  },
                ],
              },
            ].map((el, i) => (
              <div key={`info-token-${i}`} className="flex flex-col py-4 gap-3">
                <TextH>{el.label}</TextH>
                <div className="flex flex-col gap-2 ">
                  {el.values.map((o, j) => (
                    <div
                      key={`info-token-${i}-${j}`}
                      className="flex items-center justify-between gap-5"
                    >
                      <p className="text-muted-foreground">{o.label}</p>
                      <div
                        className={cn(
                          "font-semibold gap-3 flex items-center",
                          o.value && "text-red-600",
                          (o as any)?.className &&
                            o.value &&
                            (o as any)?.className
                        )}
                      >
                        {o.value || "undefined"}{" "}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
};
