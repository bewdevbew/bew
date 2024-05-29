import { TextH } from "@/components/common/text/TextH";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/app";
import { AnimatedBeamSimpleInput } from "@/sections/ui/AnimatedBeam/AnimatedBeamMultipleOutput";
import { TokenBalances, TokenReputationType } from "@/types/dew/contract";
import { formatNumber } from "@/utils/ux";
import { DonutChart } from "@tremor/react";
import React from "react";
import { TokenAvatar } from "./TokenAvatar";
import { Button } from "@/components/ui/button";
import { getContract } from "@/hooks/useContract";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "@/context/form";
import { TokenBtnFundReputation } from "./TokenBtnFundReputation";

export const TokenVsTokenAllocation = ({
  token1,
  token2,
  balance,
  variant = "info",
}: {
  variant?: "destructive" | "info";

  token1: TokenReputationType;
  token2: TokenReputationType;
  balance: TokenBalances<"guest" | "current">;
}) => {
  const { data: session } = useAuth();

  const data: {
    value: number;
    name: string;
  }[][] = (["personal", "temporary"] as ["personal", "temporary"]).map((el) => [
    {
      value: Number(balance?.global?.[el]),
      name: "Balance Contract Global",
    },
    {
      value: Number(balance?.wallet?.[el]),
      name: `Balance Admin`,
    },
    {
      value: Number(balance?.reputation?.[el]),
      name: `Balance Reputation`,
    },
    {
      value: Number(balance?.sponsor?.current?.[el]),
      name: `Balance Sponsor ${
        {
          temporary: token2.name,
          personal: token1.name,
        }[el]
      }`,
    },
    {
      value: Number(balance?.sponsor?.guest?.[el]),
      name: `Balance Sponsor ${
        {
          personal: token2.name,
          temporary: token1.name,
        }[el]
      }`,
    },
    {
      value: Number(balance?.governance?.[el]),
      name: `Balance Governannce`,
    },
    {
      value:
        Number(token1.supply) -
        Number(balance?.global.personal) -
        Number(balance?.global.temporary) -
        Number(balance?.wallet.personal) -
        Number(balance?.wallet.temporary),
      name: `Rest supply`,
    },
  ]);

  return (
    <Card className="w-fit overflow-hidden   gap-5">
      <TokenBtnFundReputation
        className="w-fit ml-auto"
        token={token1.address === session.token.address ? token2 : token1}
        balance={balance}
      />
      <div className="flex items-center relative gap-5">
        <DonutChart
          data={[...data[0], ...data[1]]}
          className="w-40 z-5 shadow-2xl rounded-full  "
          variant="donut"
          category="value"
          index="name"
          colors={["yellow", "green", "amber", "red", "indigo"]}
        />
        <span
          className={`w-20 font-black absolute top-1/2 left-0 translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full h-20 text-info-foreground border shadow ${
            {
              info: "bg-info",
              destructive: "bg-destructive",
            }[variant]
          } `}
        >
          {token1?.symbol}
        </span>

        {balance && (
          <div className="flex-col flex gap-10">
            {data.map((el, i) => (
              <div
                key={`balances-${i}`}
                className={`${
                  [
                    `${
                      {
                        info: "border-info",
                        destructive: "border-destructive",
                      }[variant]
                    }`,
                    ` ${
                      {
                        destructive: "border-info",
                        info: "border-destructive",
                      }[variant]
                    }`,
                  ][i]
                } border-l-4 px-4  flex backdrop-blur  shadow  flex-col gap-2 w-full`}
              >
                <div className={`flex gap-5`}>
                  <div className="flex flex-col">
                    <TextH className="">{[token1.name, token2.name][i]}</TextH>
                    <span className="mb-10">
                      {[token1.symbol, token2.symbol][i]}
                    </span>
                  </div>
                  <TokenAvatar seed={[token1.address, token2.address][i]} />
                </div>

                <div className={`flex flex-row`}>
                  {el.map((o: any, j) => (
                    <div
                      key={`balance-${i}-item-${j}`}
                      className={` flex flex-col whitespace-nowrap p-3 rounded shadow  border`}
                    >
                      <span className="text-muted-foreground text-sm">
                        {o.name}
                      </span>
                      <span className="font-black text-lg">
                        {formatNumber(o.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
