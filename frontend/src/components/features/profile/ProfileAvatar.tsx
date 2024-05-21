"use client";
import { AvatarUnknow } from "@/components/common/profile/AvatarUnknow";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getRandomPseudo, truncateAddress } from "@/utils/ux";
import { Profile, useProfilesManaged } from "@lens-protocol/react-web";
import React from "react";

const colors = ["#00C9A7", "#FFB800", "#FF3D71", "#1E86FF"];

export function ProfileAvatar({
  size = 80,
  address,
  profile,
  color = 0,
  showTooltip = false,
  showBadge,
}: {
  address?: `0x${string}`;
  color?: number;
  showTooltip?: boolean;
  showBadge?: boolean;
  size?: number;
  profile?: Profile;
}) {
  const { data } = useProfilesManaged({ for: address || "0x" });

  if (!address && !profile) {
    return (
      <Skeleton
        style={{ width: size, height: size }}
        className="rounded-full"
      />
    );
  }

  const infos = {
    name:
      profile?.metadata?.displayName ||
      (data && data?.[data?.length - 1]?.metadata?.displayName) ||
      getRandomPseudo(address || "0x"),
    img:
      (profile as any)?.metadata?.picture?.optimized?.uri ||
      (data &&
        (data as any)?.[data?.length - 1]?.metadata?.picture?.optimized?.uri),
  };

  return (
    <AnimatedTooltip
      active={showTooltip}
      name={infos.name}
      designation={truncateAddress(
        (address || profile?.ownedBy?.address) as any
      )}
      id={4}
    >
      {infos?.img ? (
        <img
          src={infos?.img}
          className="rounded-full border shadow"
          style={{
            width: size,
            height: size,
            maxWidth: size,
            maxHeight: size,
            minHeight: size,
            minWidth: size,
            backgroundColor: colors?.[color],
          }}
        />
      ) : (
        <AvatarUnknow color={colors?.[color]} seed={address} size={size} />
      )}
      {data && data?.length > 1 && showBadge && (
        <Badge
          className="bg-info -translate-y-full text-white absolute absolute-0 right-0 translate-x-1/2"
          variant={"outline"}
        >
          {data.length}
        </Badge>
      )}
    </AnimatedTooltip>
  );
}
