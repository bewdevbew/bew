"use client";
import { Logo } from "@/components/assets/Logo";
import { TextH } from "@/components/common/text/TextH";
import { ProfileName } from "@/components/features/profile/ProfileName";
import { ModuleLayout } from "@/components/module/ui/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { APP } from "@/constants/app";
import { useAuth } from "@/context/app";
import { cn } from "@/utils/ui";
import { Brain, Pencil, Webhook } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { useAccount } from "wagmi";

export default () => {
  const { data: session } = useAuth();
  const { address } = useAccount();
  const constraintsRef = useRef<HTMLDivElement>(null);
  return (
    <main
      ref={constraintsRef}
      className="w-screen h-full flex items-center justify-center p-40"
    >
      <div className="w-1/2 h-[70vh] flex flex-col">
        <div className="flex flex-col">
          <img src="./aly.png" style={{ width: 80 }} alt="" />
          <TextH className="text-4xl mt-10 font-semibold">
            Hello <ProfileName profile={session?.lens || address || "0x"} />
          </TextH>
          <p className="font-semibold text-4xl text-muted-foreground">
            What do we want to build today ?
          </p>
        </div>

        <div className="flex gap-10 mt-20">
          {[
            {
              header: "API system",
              icon: <Webhook />,
              title: "API keys",
              href: "/playground/",
              desc: (
                <>
                  Access control of your API <br /> with Token Reputation
                </>
              ),
            },
            {
              header: "Style system",
              icon: <Pencil />,
              title: `Design ${APP.name}`,
              href: "/playground/design",
              desc: (
                <>
                  Build your own dApp & share your works
                  <br />
                  with your reputation token
                </>
              ),
            },
            {
              header: "AI system",
              icon: <Brain />,
              title: `Improve Aly`,
              href: "/playground/",
              desc: (
                <>
                  Add Aly features and improve its AI
                  <br />
                  with your reputation token
                </>
              ),
            },
          ].map((el, i) => (
            <div
              key={`playground-dev-choice-${i}`}
              className=" transition hover:scale-105 hover:z-10 w-[130px]"
            >
              <Card
                constraintsRef={constraintsRef}
                padding="px-6 py-8"
                className={`magicpattern gap-2 on-hover-parent flex-row justify-between  rounded-[10%]
                  ${i % 2 === 0 ? "rotate-3" : "-rotate-3"}`}
              >
                <div className="flex flex-col gap-2">
                  <p className=" font-bold uppercase mb-8 text-info">
                    {el.header}
                  </p>

                  <div
                    className={`shadow w-fit text-background border p-3 rounded-full ${
                      ["bg-amber-700", "bg-green-500", "bg-info"]?.[i]
                    }`}
                  >
                    {el.icon}
                  </div>
                  <TextH>{el.title}</TextH>
                  <div className="flex items-end justify-between">
                    <p>{el.desc}</p>
                  </div>
                </div>
                <Link
                  className="px-5 whitespace-nowrap h-fit mt-auto on-hover-child py-3 border bg-background shadow rounded-lg"
                  href={el.href}
                >
                  Let's go
                </Link>
              </Card>
            </div>
          ))}
        </div>
        <Textarea
          className="w-full mt-auto"
          placeholder="Ask me anything ..."
        />
      </div>
    </main>
  );
};
