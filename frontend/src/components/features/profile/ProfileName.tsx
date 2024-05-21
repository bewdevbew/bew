import { TextH } from "@/components/common/text/TextH";
import { cn } from "@/utils/ui";
import { getRandomPseudo, truncateAddress } from "@/utils/ux";
import { Profile } from "@lens-protocol/react-web";
import React from "react";

export const ProfileName = ({
  profile,
  className,
  withHandle,
}: {
  className?: string;
  withHandle?: boolean;
  profile: Profile | `0x${string}`;
}) => {
  const data =
    typeof profile === "string"
      ? {
          name: getRandomPseudo(profile),
          bio: truncateAddress(profile),
        }
      : {
          name: profile?.metadata?.displayName,
          bio: profile?.handle?.fullHandle,
        };
  if (withHandle) {
    return (
      <div className={cn("flex-col gap-1", className)}>
        <TextH>{data.name}</TextH>
        <p className="font-extralight text-sm">{data.bio}</p>
      </div>
    );
  }

  return <>{data.name}</>;
};
