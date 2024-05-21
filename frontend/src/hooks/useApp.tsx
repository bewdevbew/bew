import { useLastLoggedInProfile } from "@lens-protocol/react-web";
import { getContract, useContract } from "./useContract";
import { AuthAppType } from "@/context/app";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";

export const useProfile = ({ address }: { address: `${string}` }) => {
  const { contract: iFactory } = useContract("factory");

  // const { execute, loading, data: lens, error, ...rest } = useLogin();
  // const o = useSession();

  const { data: lens, ...restLens } = useLastLoggedInProfile({
    for: address || "0x",
  });

  const get = async () => {
    if (address) {
      const tokenAddr = await iFactory.tokenOf(address);
      console.log({ tokenAddr });
      const iToken = getContract("token", tokenAddr as `0x${string}`);

      const balance = await iToken.balanceOf(address);
      const info = await iToken.getInfo();
      const events = await iToken.queryFilter(
        iToken.filters.NewTokenOnboarded()
      );

      const data: AuthAppType["data"] = {
        token: {
          name: info.name,
          symbol: info.symbol,
          legacy: Number(info.legacy),
          supply: ethers.formatEther(info.totalSupply) as any,
          network: info.networkToken as "0x${string}",
          balance: ethers.formatEther(balance) as any,
          balanceNetwork: ethers.formatEther(info.balanceNetwork) as any,
          balanceAdmin: ethers.formatEther(info.balanceAdmin) as any,
          address: tokenAddr as `0x${string}`,
          rules: info.rules,
          events: {
            newTokenOnboarded: events
              .filter((el, i) => i < 10)
              .map(
                (el) =>
                  ({
                    ...el,
                    to: el.args.to,
                    token: el.args.token,
                    value: el.args.value,
                  } as any)
              ),
          },
        },

        lens,
      };

      return data;
    }
  };

  const o = useQuery({
    queryKey: [address, "login"],
    queryFn: get,
    enabled: !!address,
  });
  return {
    ...o,
    data: {
      lens: o.data?.lens || lens,
      token: o.data?.token,
    },
  } as typeof o & { data: AuthAppType["data"] };
};
