"use client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/app";
import { getContract } from "@/hooks/useContract";
import { useQuery } from "@tanstack/react-query";
import { AppContextType } from "next/dist/shared/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { DataTypes } from "../../../../contract/typechain/contracts/TokenReputation";
import { useProfile } from "@/hooks/useApp";
import { ethers } from "ethers";
import { TextRotate } from "@/components/common/text/TextRotated";
import { cn } from "@/utils/ui";
import { motion } from "framer-motion";

/**
 *
 * @returns Aly l'AI assistant toujours disponible pour vous aider
 * Il est accessible en popup ancré en bas à droite de l'écran
 * Informe sur l'état du réseau.
 * Donne des informations connue sur le profile et le token visité
 *
 */
export const AIPopupLayout = () => {
  const { data } = useAuth();
  const { address } = useAccount();

  const pathname = usePathname();
  // Retirer le premier index
  const splitedPathname = pathname.split("/").filter((_, i) => i !== 0);

  const { data: profileVisited } = useProfile({
    address: splitedPathname?.[1] as `0x${string}`,
  });

  const getResponse = async () => {
    const token = data?.token;

    let text: { text: string; color?: string }[] = [];
    if (data.lens) {
      text.push({
        text: "Don't forget to talk about us on Lens Protocole",
        color: "info",
      });
    } else {
      text.push({
        text: "Maybe we could create a profile on Lens Protocole to growth our world",
        color: "#FFBD7B",
      });
    }
    if (token) {
      if (
        Number(token.supply) <
        Number(ethers.formatEther(token.rules.maxSupply)) / 3
      ) {
        text.push({
          text: "We have lot of work to do Daddy ! Nobody know us 😣",
        });
      } else {
        text.push({
          text: "What a job Daddy ! Many people know us 😇",
          color: "green",
        });
      }

      if (Number(token.balanceAdmin) < Number(token.supply) / 2) {
        text.push(
          ...[
            "Are you sure y0v're good D4dDi ? We don't recognize you 🫣",
            "If yoU d0m't wàn't l0ose us, invite new friends",
          ].map((el) => ({
            text: el,
            color: "#EF4443",
          }))
        );
      } else {
        text.push({
          text: "We are in great shape dad !",
          color: "green",
        });
      }

      if (token.legacy > 0) {
        text.push({ text: "Maybe our friends can help us for do some stuff" });
      } else {
        text.push({
          text: `Invite our friends to ${token.name} and build together`,
        });
      }
    } else if (profileVisited?.token?.admin) {
      text.push({
        text: `Hello, we are ${(profileVisited as any).name} ! Who are you ?`,
      });
    } else {
      text.push(
        ...[
          "Hello, we are ZeroDay. Do you have your token reputation ?",
          "Go ask Dew, we might have one for you",
        ].map((el) => ({
          text: el,
          color: "fuchsia",
        }))
      );
    }

    switch (splitedPathname?.[0]) {
      case "social":
        text.push({
          text: "Do you want to share our social network ?",
        });
        break;
      case "create":
        text.push({
          text: "Do you want to create a token reputation ?",
        });
        break;
      case "protocol":
        text.push({
          text: "Do you want to know more about our protocol ?",
        });
        break;
      case "profile":
        text.push({
          text: `Do we want to know more about ${
            profileVisited?.token?.name || "this profile"
          } ?`,
        });
        break;
    }

    return text;
  };

  const { data: aiResponse, ...restAI } = useQuery({
    enabled: !!splitedPathname?.[0],
    queryKey: ["ai-popup", splitedPathname?.[0]],
    queryFn: getResponse,
  });

  const [index, setIndex] = useState(0);
  const duration = 10000;
  useEffect(() => {
    if (aiResponse?.length === 0) return;
    const timer = setTimeout(() => {
      setIndex((index + 1) % (aiResponse?.length || 0));
    }, duration);

    return () => clearTimeout(timer);
  }, [aiResponse]);

  return (
    <Card
      className={cn(
        "overflow-visible flex-row transition hover:h-fit min-h-[90px]  flex items-start gap-4 text-end h-[90px] fixed bottom-10 right-8 rounded-full w-[330px] pl-20"
      )}
    >
      <img
        src="/aly.png"
        className="w-[80px] absolute top-1/2 left-0 -translate-x-1/3 -translate-y-1/2"
      />

      <TextRotate
        duration={duration}
        colors={aiResponse?.map((el) => el?.color || "#000")}
        words={
          aiResponse
            ? aiResponse.map((el) => el.text)
            : ["Coucou je m'appelle Aly !"]
        }
        className="font-black  text-muted-foreground"
      />
    </Card>
  );
};