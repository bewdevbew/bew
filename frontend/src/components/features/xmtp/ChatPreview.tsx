import { useProfiles } from "@lens-protocol/react-web";
import { Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import React, { useEffect, useState } from "react";

import { useForm } from "@/context/form";

import Link from "next/link";
import { cn } from "@/utils/ui";
import { ProfileAvatar } from "../profile/ProfileAvatar";
import { getRandomPseudo } from "@/utils/ux";
import { TextTruncated } from "@/components/common/text/TextTruncated";

export const ChatPreview = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const { data: searchProfile } = useProfiles({
    where: { ownedBy: [conversation.peerAddress] },
  });

  const recipient = searchProfile?.[0];

  const [lastMessage, setLastMessage] = useState<DecodedMessage | null>(null);

  const { set, getValue } = useForm();

  useEffect(() => {
    if (conversation) {
      (async () => {
        const messages = await conversation?.messages();
        setLastMessage(messages[messages.length - 1]);
      })();
    }
  }, []);

  return (
    <div
      onClick={() =>
        set(
          "recipient",

          getValue("recipient") !== conversation?.peerAddress
            ? conversation?.peerAddress
            : null
        )
      }
      className={cn(
        "flex rounded gap-2 items-center px-3 py-5 w-full cursor-pointer",
        getValue("recipient") === conversation.peerAddress
          ? "bg-info text-info-foreground shadow"
          : "hover:bg-info/20"
      )}
    >
      <ProfileAvatar
        size={80}
        address={conversation.peerAddress as `0x${string}`}
        profile={recipient}
      />

      <div className="flex flex-col gap-1">
        <Link
          className={cn(
            "hover:text-info font-bold text-lg hover:underline",
            conversation?.peerAddress === getValue("recipient") &&
              "hover:text-white"
          )}
          href={"/profile/"}
        >
          {recipient?.metadata?.displayName ||
            recipient?.handle?.localName ||
            getRandomPseudo(conversation.peerAddress as `0x${string}`)}
        </Link>
        <p className="text-sm font-light opacity-80">
          <TextTruncated maxLength={40}>
            {lastMessage?.content || ""}
          </TextTruncated>
        </p>
      </div>
      <span className="ml-auto mb-auto opacity-60 text-xs font-light">
        {lastMessage?.sent.toLocaleTimeString()}
      </span>
    </div>
  );
};
