"use client";

import { Chat } from "@/components/features/xmtp/Chat";
import { ChatPreview } from "@/components/features/xmtp/ChatPreview";
import { Input } from "@/components/ui/input";
import { useForm } from "@/context/form";

import { useClientXmtp, useProfileXmtp } from "@/hooks/useXmtp";

import React, { useEffect } from "react";

export default function PageMessages() {
  const { set, getValue } = useForm();
  const client = useClientXmtp();

  const { data: profileXmtp } = useProfileXmtp(
    client?.address as `0x${string}`
  );
  const { conversations } = profileXmtp || {};

  useEffect(() => {
    if (profileXmtp?.conversations?.length && !getValue("recipient")) {
      set("recipient", profileXmtp?.conversations[0].peerAddress);
    }
  }, [profileXmtp]);
  if (!client) {
    return <>Occupe toi du login xmtp</>;
  }

  return (
    <>
      <div className={"w-full flex "}>
        <div className="flex flex-col border-r h-full w-[30vw]">
          <div className="p-10 border-y w-full">
            <Input className="w-full" target={"recipient"} />
          </div>

          <div className="flex flex-col px-10 py-5 w-full gap-2 h-screen overflow-y-auto">
            {conversations?.map((el, i) => (
              <ChatPreview key={`list-contact-${i}`} conversation={el} />
            ))}
          </div>
        </div>
        <Chat conversations={conversations} />
      </div>
    </>
  );
}
