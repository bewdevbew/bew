import { Logo } from "@/components/assets/Logo";
import { AvatarUnknow } from "@/components/common/profile/AvatarUnknow";
import { TextH } from "@/components/common/text/TextH";
import { HoverCard } from "@/components/ui/hover-card";
import { DEW_STANDARD } from "@/constants/standard";
import {
  AnimatedBeamDefault,
  AnimatedBeamMultipleInput,
  AnimatedBeamMultipleOutput,
  AnimatedBeamSimpleInput,
} from "@/sections/ui/AnimatedBeam/AnimatedBeamMultipleOutput";
import React, { ReactNode } from "react";

type KeyType = keyof typeof DEW_STANDARD;

const StandardInfo = ({ target }: { target: KeyType }) => {
  return (
    <div className="min-w-[400px]">
      <div className="flex gap-10 items-center">
        <Logo size={44} />
        <div className="flex flex-col">
          <TextH>{target}</TextH>
        </div>
      </div>
      <ul>
        <li className="flex gap-10 items-center mt-5">
          Network gain :{" "}
          <span>{DEW_STANDARD[target]?.networkParticipationPercentage}%</span>
        </li>
        <li className="flex gap-10 items-center mt-5">
          Admin gain :{" "}
          <span>{DEW_STANDARD[target].adminRetainedTokensPercentage}%</span>
        </li>
        <li className="flex gap-10 items-center mt-5">
          Network loss :{" "}
          <span>{DEW_STANDARD[target].adminRetainedTokensPercentage}%</span>
        </li>
        <li className="flex gap-10 items-center mt-5">
          New token gain :{" "}
          <span>{DEW_STANDARD[target].adminRetainedTokensPercentage}%</span>
        </li>
      </ul>
    </div>
  );
};

export const CardStandardBeam = ({ target }: { target: KeyType }) => {
  const header = (
    <>
      <TextH className="capitalize">{target}</TextH>
      <HoverCard className="ml-auto text-muted-foreground">
        <StandardInfo target={target} />
      </HoverCard>
    </>
  );

  const component = {
    ward: (
      <AnimatedBeamMultipleInput
        className="magicpattern1 text-muted"
        root={<AvatarUnknow />}
        node={<Logo className="rounded-full" />}
        multiple={[
          <AvatarUnknow seed="1" />,
          <AvatarUnknow seed="2" />,
          <AvatarUnknow seed="3" />,
          <AvatarUnknow seed="4" />,
          <AvatarUnknow seed="5" />,
        ]}
        header={header}
      />
    ),
    dictator: (
      <AnimatedBeamSimpleInput
        className="magicpattern2 h-full"
        root={<Logo className="rounded-full" />}
        node={<AvatarUnknow />}
        multiple={[<Logo className="rounded-full" />]}
        header={header}
      />
    ),
    explorer: (
      <AnimatedBeamDefault
        className="magicsky"
        node={<AvatarUnknow />}
        multipleStart={[
          <AvatarUnknow seed="2" />,
          <AvatarUnknow seed="3" />,
          <Logo className="rounded-full" />,
        ]}
        multipleEnd={[
          <AvatarUnknow seed="1" />,
          <AvatarUnknow seed="2" />,
          <AvatarUnknow seed="3" />,
        ]}
        header={header}
      />
    ),
    centralized: (
      <AnimatedBeamMultipleOutput
        className="magicpattern"
        root={<Logo className="rounded-full" />}
        node={<AvatarUnknow />}
        multiple={[
          <Logo className="rounded-full" />,

          <AvatarUnknow seed="2" />,
          <AvatarUnknow seed="3" />,
          <AvatarUnknow seed="4" />,

          <Logo className="rounded-full" />,
        ]}
        header={header}
      />
    ),
  }[target];

  return component;
};
