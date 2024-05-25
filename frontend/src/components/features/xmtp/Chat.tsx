"use client";
import React, { useContext, useEffect, useState } from "react";

import { useForm } from "@/context/form";

import { useLastLoggedInProfile } from "@lens-protocol/react-web";

import { Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import { isValidAddress } from "@xmtp/react-sdk";

import { useClientXmtp, useProfileXmtp } from "@/hooks/useXmtp";
import { useToast } from "@/components/ui/use-toast";
import { ProfileAvatar } from "../profile/ProfileAvatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/ui";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Chat = ({
  conversations,
}: {
  conversations: Conversation[] | undefined;
}) => {
  const { set, getValue } = useForm();
  const { toast } = useToast();

  const client = useClientXmtp();
  const { data: recipient } = useLastLoggedInProfile({
    for: getValue("recipient") as any,
  });
  const { data: myProfile } = useLastLoggedInProfile({
    for: client?.address as any,
  });
  const [canMessage, setCanMessage] = useState(false);
  const [messages, setMessages] = useState<DecodedMessage[] | null>(null);

  useEffect(() => {
    if (getValue("recipient") && isValidAddress(getValue("recipient"))) {
      (async () => {
        const bool =
          getValue("recipient") === client?.address
            ? false
            : await client?.canMessage(getValue("recipient"));
        setCanMessage(bool || false);
        if (bool) {
          let conversation = conversations
            ? conversations.find(
                (el: any) => el.peerAddress === getValue("recipient")
              )
            : null;

          try {
            if (conversation) {
              const _messages = await conversation?.messages();

              setMessages(_messages || []);
            } else {
              conversation = await client?.conversations.newConversation(
                getValue("recipient")
              );
              const _messages = await conversation?.messages();
              setMessages(_messages || []);
            }
          } catch (error) {
            toast({
              title: "Error",
              description: (error as any)?.message || "Something went wrong",
            });
          }
        } else {
          setMessages([]);
          toast({
            title: "Error",
            description: "This address haven't allowed xmtp",
          });
        }
      })();
    }
  }, [getValue("recipient")]);

  // Function to handle sending a message
  const handleSend = async () => {
    if (!getValue("message") && getValue("message") !== "") {
      toast({
        title: "Error",
        description: "Please type a message",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!client) {
        throw new Error("Client XMTP not found");
      }
      if (await client?.canMessage(getValue("recipient"))) {
        const newMessage = await (
          await client?.conversations.newConversation(getValue("recipient"))
        ).send(getValue("message"));

        set("message", "");
        toast({ title: "Success", description: "Message send" });
        setMessages((prev) => [...(prev || []), newMessage]);
      } else {
        throw new Error("Cannot send message");
      }
    } catch (error) {
      console.log({ error });
      toast({
        title: "Error",
        description: (error as any)?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex py-10 px-20 flex-col w-full bg-primary/10 overflow-y-auto">
        {(recipient ||
          (getValue("recipient") && isValidAddress(getValue("recipient")))) && (
          <ProfileAvatar
            className="w-fit"
            size={130}
            profile={recipient}
            address={getValue("recipient")}
          />
        )}

        {canMessage && getValue("recipient") !== client?.address ? (
          <>
            <div
              className={
                "border-t border-info/10 gap-6 py-10 flex flex-col max-h-[70vh] overflow-y-auto "
              }
            >
              {messages?.map(
                (el, i: number) =>
                  el?.content && (
                    <div
                      key={`message-inbox-${i}`}
                      className={cn(
                        "flex gap-10",
                        el.senderAddress !== client?.address &&
                          "flex-row-reverse"
                      )}
                    >
                      <ProfileAvatar
                        size={70}
                        address={el.senderAddress as `0x${string}`}
                        profile={
                          el?.senderAddress === client?.address
                            ? myProfile
                            : recipient
                        }
                      />

                      <Card
                        className={cn(
                          "font-light text-lg",
                          el?.senderAddress === client?.address &&
                            "bg-info text-info-foreground"
                        )}
                        width="w-full flex flex-col"
                      >
                        {el.content}
                        <span className="ml-auto text-sm opacity-60">
                          {el.sent.toLocaleTimeString()}
                        </span>
                      </Card>
                    </div>
                  )
              )}
            </div>
            <div className={"flex gap-4 mt-auto w-full"}>
              <Textarea
                placeholder="Type your message here"
                // target={"message"}
                className="min-h-[10vh] w-full"
              />
              <Button
                disabled={!getValue("message")}
                variant="default"
                onClick={handleSend}
              >
                Post
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full flex-1 h-full flex items-center">
            <p className="text-lg font-semibold text-error">
              {getValue("recipient") !== client?.address
                ? "This address haven't allowed xmtp"
                : "Self messaging not supported"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};
