import { Logo } from "@/components/assets/Logo";
import { AvatarUnknow } from "@/components/common/profile/AvatarUnknow";
import { TextH } from "@/components/common/text/TextH";
import { TextLabel } from "@/components/common/text/TextLabel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardHoverable } from "@/components/ui/card-hoverable";
import { HoverCard } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedBeamMultipleOutput } from "@/sections/ui/AnimatedBeam/AnimatedBeamMultipleOutput";

import {
  Baseline,
  CircleUser,
  Lollipop,
  Pilcrow,
  TestTubeDiagonal,
} from "lucide-react";
import React from "react";

export default () => {
  const token = {
    name: "ZeroDay",
  };
  return (
    <main className="w-screen h-full">
      <Card padding="p-0" className="w-1/2 m-auto">
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
              Hello {token.name} !
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
          <Input
            label={{
              text: "Address EVM",
              icon: <CircleUser />,
            }}
            placeholder="0x"
          />
          <Input
            label={{
              text: "Token Name",
              icon: <Baseline />,
            }}
            placeholder="ZeroDay"
          />
          <Input
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

          <div className="flex flex-col gap-4">
            <TextLabel icon={<TestTubeDiagonal />}>Token Settings</TextLabel>
            <div className="flex gap-3">
              {[
                {
                  title: "Dictator",
                  info: (
                    <>
                      Le dictateur mine 49% de l'offre totale pour son compte,
                      <br />
                      et les 51% restants sont alloués au compte de
                      l'utilisateurs
                      <br />
                      <br />
                      Avec cette configuration vous centraliserez le contrôle de
                      ce token
                      <br />
                      L'administrateur de ce token devras conserver la totalité
                      de ses tokens si
                      <br />
                      souhaitent conserver le contrôle dessus.
                    </>
                  ),
                },
              ].map((el, i) => (
                <AnimatedBeamMultipleOutput
                  key={`settings-mint-${i}`}
                  root={<Logo className="rounded-full" />}
                  node={<AvatarUnknow />}
                  multiple={[
                    <AvatarUnknow seed="1" />,
                    <AvatarUnknow seed="2" />,
                    <AvatarUnknow seed="3" />,
                    <AvatarUnknow seed="4" />,
                    <AvatarUnknow seed="5" />,
                  ]}
                  header={
                    <>
                      <TextH>{el.title}</TextH>
                      <HoverCard className="ml-auto">
                        <div className="min-w-[400px]">{el.info}</div>
                      </HoverCard>
                    </>
                  }
                />

                // <div
                //   className="border p-3 rounded-lg flex relative flex-col gap-10 w-[300px] h-[200px]"
                // >
                //   <img
                //     src={el.image}
                //     className="absolute top-O right-0 w-2/3 h-full aspect-auto  opacity-50"
                //     alt=""
                //   />
                //   <div className="flex items-center justify-between ">
                //     <TextH>{el.title}</TextH>
                //     <HoverCard>
                //       <div className="min-w-[400px]">{el.info}</div>
                //     </HoverCard>
                //   </div>
                //   {/* <p className="text-muted-foreground">{el.desc}</p> */}
                // </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
};
