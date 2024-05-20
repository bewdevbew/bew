import { useContract } from "@/hooks/useContract";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import { Card } from "@/components/ui/card";
import { ethers } from "ethers";
import { CategoryBar, Legend } from "@tremor/react";
import { useAuth } from "@/context/app";
import { truncateAddress } from "@/utils/ux";
import { HeaderCard } from "@/components/ui/header-card";
import { Waypoints } from "lucide-react";
const colors = ["green", "blue", "red", "fuchsia", "indigo", "lime"];

import { SparkAreaChart } from "@tremor/react";
import { TokenReputationType } from "@/types/dew/contract";
import { Badge } from "@/components/ui/badge";

const chartdata = [
  {
    month: "Jan 21",
    Performance: 4000,
  },
  {
    month: "Feb 21",
    Performance: 3000,
  },
  {
    month: "Mar 21",
    Performance: 2000,
  },
  {
    month: "Apr 21",
    Performance: 2780,
  },
  {
    month: "May 21",
    Performance: 1890,
  },
  {
    month: "Jun 21",
    Performance: 2390,
  },
  {
    month: "Jul 21",
    Performance: 3490,
  },
];

export const TokenNetworkView = ({ token }: { token: TokenReputationType }) => {
  const { contract } = useContract("token");

  const { data, ...rest } = useQuery({
    enabled: !!contract && !!token,
    queryKey: ["token", token.address],

    queryFn: async () => {
      const events = await contract.queryFilter(
        contract.filters.NewTokenOnboarded()
      );
      const arr = [];
      for (let i = 0; i < events.length; i++) {
        arr.push({
          reputation: ethers.formatEther(
            await contract.poolTokensReputation(events[i].args.token)
          ),
          sponsor: ethers.formatEther(
            await contract.poolTokensForSponsor(
              token.address,
              events[i].args.token
            )
          ),
          address: events[i].args.token,
        });
      }
      return arr;
    },
  });

  console.log({ data, rest });

  return (
    <>
      <Card className="">
        <HeaderCard className="mb-4" icon={<Waypoints />}>
          Token Network
        </HeaderCard>

        <CategoryBar
          showLabels={false}
          values={(data || [])?.map((el) => Number(el.sponsor))}
          colors={colors as any}
        />
        <Legend
          className="mt-3 text-xs"
          categories={(() => {
            const a = [
              ...(data || [])
                ?.filter((_, i) => i < 5)
                .map((el) => truncateAddress(el.address)),
            ];

            if ((data as any)?.length > 5) {
              a.push("...");
            }
            return a;
          })()}
          colors={colors}
        />
      </Card>

      <Card className="flex-row w-full items-center justify-between relative  overflow-visible">
        <Badge
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          variant="outline"
        >
          Bêta
        </Badge>
        <div className="flex items-center space-x-2.5">
          <p className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
            {token.symbol}
          </p>
          <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            {token.name}
          </span>
        </div>
        <SparkAreaChart
          data={chartdata}
          categories={["Performance"]}
          index={"month"}
          colors={["emerald"]}
          className="h-8 w-20 sm:h-10 sm:w-36"
        />
        <div className="flex items-center space-x-2.5">
          <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
            179.26
          </span>
          <span className="rounded bg-emerald-500 px-2 py-1 text-tremor-default font-medium text-white">
            +1.72%
          </span>
        </div>
      </Card>
    </>
  );
};
