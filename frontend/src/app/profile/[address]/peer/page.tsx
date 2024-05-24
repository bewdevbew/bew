"use client";
import { Flow } from "@/components/common/reactflow";
import { TextH } from "@/components/common/text/TextH";
import { ProfileAvatar } from "@/components/features/profile/ProfileAvatar";
import { ProfileName } from "@/components/features/profile/ProfileName";
import { useAuth } from "@/context/app";
import { useProfile } from "@/hooks/useApp";
import { formatNumber } from "@/utils/ux";
import { DonutChart, Legend } from "@tremor/react";
import { Network } from "lucide-react";
import React from "react";
import { useAccount } from "wagmi";

export default ({ params }: { params: { address: `0x${string}` } }) => {
  const { address, ...rest } = useAccount();
  const { data: session } = useAuth();
  const { data: profile } = useProfile({
    address: params.address,
    enabled: !!address || rest.status !== "connected",
  });

  console.log({ session, profile });

  const current = profile?.token?.interaction?.current;
  const peer = profile?.token?.interaction?.peer;
  if (!current || !peer) return <>Loading ...</>;
  return (
    <div className="w-full h-screen bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800">
      <Flow
        data={[
          {
            icon: <Network />,
            title: `${profile.token.name} Network`,
            subline: (
              <>
                Token of{" "}
                <ProfileName profile={profile.lens || profile.token.admin} />
              </>
            ),
            info: (
              <>
                <ProfileAvatar
                  size={30}
                  profile={profile?.lens}
                  address={profile?.token?.admin}
                />
              </>
            ),
          },
          {
            icon: <ProfileAvatar size={30} address={profile?.token?.admin} />,
            title: `Total Balance on ${profile.token.name}`,
            subline: (
              <>
                {(
                  (Number(profile.token.balanceNetwork) /
                    Number(profile.token.supply)) *
                  100
                ).toFixed(2)}{" "}
                % of {profile.token.symbol}
              </>
            ),
            info: (
              <>
                <DonutChart
                  variant="pie"
                  data={[
                    {
                      name: `Network balance${profile?.token?.name}`,
                      value: Number(profile?.token?.balanceNetwork),
                    },
                    {
                      name: `Not on network`,
                      value:
                        Number(profile?.token?.supply) -
                        Number(profile?.token?.balanceNetwork),
                    },
                  ]}
                  category="value"
                  index="name"
                  valueFormatter={(num: number) => `$ ${formatNumber(num)}`}
                  colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
                  className="w-10 h-10"
                ></DonutChart>
              </>
            ),
          },
          {
            icon: (
              <ProfileAvatar
                profile={session?.lens}
                size={30}
                address={session?.token?.admin}
              />
            ),
            title: `Network balance on ${session.token.name}`,
            subline: (
              <>
                {(
                  (Number(current.balanceToken) /
                    Number(session.token.supply)) *
                  100
                ).toFixed(2)}{" "}
                % of {session.token.symbol}
              </>
            ),
            info: (
              <>
                <DonutChart
                  variant="pie"
                  data={[
                    {
                      name: `Network balance ${session?.token?.name}`,
                      value: Number(current?.balanceToken),
                    },
                    {
                      name: `Not on network`,
                      value:
                        Number(profile?.token?.supply) -
                        Number(current?.balanceToken),
                    },
                  ]}
                  category="value"
                  index="name"
                  valueFormatter={(num: number) => `$ ${formatNumber(num)}`}
                  colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
                  className="w-10 h-10"
                ></DonutChart>
              </>
            ),
          },
          {
            icon: <Network />,
            title: `${profile.token.name} Network`,
            subline: (
              <>
                Token of{" "}
                <ProfileName profile={session?.lens || session?.token?.admin} />
              </>
            ),
            info: (
              <>
                <ProfileAvatar
                  size={30}
                  profile={session?.lens}
                  address={session?.token?.admin}
                />
              </>
            ),
          },
          {
            icon: <ProfileAvatar size={30} address={session?.token?.admin} />,
            title: `Total Balance on ${session?.token?.name}`,
            subline: (
              <>
                {(
                  (Number(session?.token?.balanceNetwork) /
                    Number(session?.token?.supply)) *
                  100
                ).toFixed(2)}{" "}
                % of {session?.token?.symbol}
              </>
            ),
            info: (
              <>
                <DonutChart
                  variant="pie"
                  data={[
                    {
                      name: `Network balance ${session?.token?.name}`,
                      value: Number(session?.token?.balanceNetwork),
                    },
                    {
                      name: `Not on network`,
                      value:
                        Number(session?.token?.supply) -
                        Number(session?.token?.balanceNetwork),
                    },
                  ]}
                  category="value"
                  index="name"
                  valueFormatter={(num: number) => `$ ${formatNumber(num)}`}
                  colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
                  className="w-10 h-10"
                ></DonutChart>
              </>
            ),
          },
          {
            icon: (
              <ProfileAvatar
                profile={profile?.lens}
                size={30}
                address={profile?.token?.admin}
              />
            ),
            title: `Network balance on ${profile?.token?.name}`,
            subline: (
              <>
                {(
                  (Number(peer?.balanceToken) /
                    Number(profile?.token?.supply)) *
                  100
                ).toFixed(2)}{" "}
                % of {profile?.token?.symbol}
              </>
            ),
            info: (
              <>
                <DonutChart
                  variant="pie"
                  data={[
                    {
                      name: `Network balance ${profile?.token?.name}`,
                      value: Number(peer?.balanceToken),
                    },
                    {
                      name: `Not on network`,
                      value:
                        Number(session?.token?.supply) -
                        Number(peer?.balanceToken),
                    },
                  ]}
                  category="value"
                  index="name"
                  valueFormatter={(num: number) => `$ ${formatNumber(num)}`}
                  colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
                  className="w-10 h-10"
                ></DonutChart>
              </>
            ),
          },

          //   {
          //     icon: <ProfileAvatar size={30} address={session?.token?.admin} />,
          //     title: formatNumber(current.balanceSponsorByAdmin),
          //     subline: "Balance Sponsor",
          //   },
          //   {
          //     icon: <ProfileAvatar size={30} address={session?.token?.admin} />,
          //     title: formatNumber(current.balanceGovernance),
          //     subline: "Balance Governance",
          //   },
          //   {
          //     icon: <ProfileAvatar size={30} address={session?.token?.admin} />,
          //     title: formatNumber(current.balanceReputation),
          //     subline: "Balance Reputation",
          //   },
        ]}
      />
    </div>
  );
};
