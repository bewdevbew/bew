import { useLastLoggedInProfile } from "@lens-protocol/react-web";
import { AuthAppType } from "@/context/app";
import { useAccount } from "wagmi";
import { useApi } from "./useApi";

export const useProfile = ({
  address,
  enabled = true,
}: {
  address: `0x${string}`;
  enabled?: boolean;
}) => {
  const { address: myAddress } = useAccount();
  const { data: lens } = useLastLoggedInProfile({
    for: address || "0x",
  });

  const { data: token, ...restApi } = useApi({
    enabled: !!address && enabled,
    path: "/token/data",
    params: { adminAddress: address, peerAdminAddress: myAddress as any },
  });

  return {
    ...restApi,
    data: {
      lens: lens,
      token: token,
    },
  } as typeof restApi & { data: AuthAppType["data"] };
};
