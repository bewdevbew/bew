import { Button } from "@/components/ui/button";

import {
  AnyPublication,
  ExplorePublication,
  Profile,
  ProfileId,
  profileId,
  publicationId,
  useBookmarkToggle,
  useHidePublication,
  useLazyProfiles,
  useNotInterestedToggle,
  useSession,
  useWhoReactedToPublication,
} from "@lens-protocol/react-web";

import {
  BadgeCheck,
  Ban,
  Bookmark,
  ClipboardCopy,
  ClipboardCopyIcon,
  EyeOff,
  Grab,
  HeartOff,
  Languages,
  Lock,
  MessageSquare,
  Repeat,
  Slash,
  Sparkles,
  SquareArrowUpRight,
  TriangleAlert,
  Unlock,
} from "lucide-react";
import Link from "next/link";
import React, { Fragment, useEffect, useRef, useState } from "react";

import { useToast } from "@/components/ui/use-toast";

import { useAccount } from "wagmi";

import { cn } from "@/utils/ui";
import { APP, LENS_APPS } from "@/constants/app";
import { ProfileAvatar } from "../profile/ProfileAvatar";

import { ProfileName } from "../profile/ProfileName";
import { TextTruncated } from "@/components/common/text/TextTruncated";
import { PublicationEncrypted } from "./PublicationEncrypted";
import { PublicationBtnUpvotes } from "./PublicationBtns";
import { PublicationBtnCreateMirror } from "./PublicationBtnCreateMirror";
import { HoverCard } from "@/components/ui/hover-card";
import { useApi } from "@/hooks/useApi";
import { ProfileBtnFollow } from "../profile/ProfileBtnFollow";

type PublicationProps = {
  publication: ExplorePublication | AnyPublication;
};
export const PublicationCard = ({ publication }: PublicationProps) => {
  return publication.__typename === "Post" ? (
    <PublicationPost publication={publication} />
  ) : publication.__typename === "Comment" ? (
    <PublicationQuote publication={publication} />
  ) : publication.__typename === "Mirror" ? (
    <div className="pt-4">
      <div className="flex pl-4 opacity-80 items-center gap-1 text-info">
        <Repeat />
        <b>{publication?.by?.handle?.localName}</b>
        mirrored
      </div>

      <PublicationPost publication={publication.mirrorOn as any} />
    </div>
  ) : (
    <div className="pt-4">
      <div className="flex pl-4 opacity-80 items-center gap-1 text-info">
        <Repeat />
        <b>{publication?.by?.handle?.localName}</b>
        quoted
      </div>

      <PublicationPost publication={publication.quoteOn as any} />
    </div>
  );
};

const PublicationPost = ({
  publication,
  variants,
}: {
  publication: ExplorePublication;
  variants?: "commentary" | undefined;
}) => {
  const { metadata, by, stats, __typename, ...rest } = publication;
  const { execute: toggleBookmark } = useBookmarkToggle();
  const { execute: toggleNotInterested } = useNotInterestedToggle();
  const { execute: toggleHidePublication } = useHidePublication();

  const { toast } = useToast();
  const { address } = useAccount();

  const appKnown = LENS_APPS.find(
    (app) => app.id === publication?.publishedOn?.id
  );

  const [textTranslate, setTextTranslate] = useState<string | null>(null);
  const { execute: translate } = useApi({
    path: "/ai/translate",
    params: {
      text: (publication.metadata as any)?.content,
      lang: navigator?.language || navigator?.languages[0],
    },
    enabled: false,
  });

  console.log({ publication });

  return (
    <div
      className={cn(
        " flex gap-2 hover:bg-info/5  ",
        variants === "commentary" ? "" : "border-b"
      )}
    >
      <div
        className={cn(
          `sm:px-6 px-2 relative w-full  flex pt-6 gap-3`,
          variants === "commentary" ? "" : " mb-4  pb-2"
        )}
      >
        <div className="flex w-fit items-center flex-col">
          <ProfileAvatar showTooltip showBadge size={50} profile={by} />
          {variants === "commentary" && (
            <>
              <div className="h-full w-1 bg-info/50 "></div>
            </>
          )}
        </div>
        <HoverCard className="absolute top-3 right-0" trigger={":"}>
          <div className="flex flex-col">
            {[
              {
                content: "Report Post",
                variant: "destructive",
                Icon: <TriangleAlert />,
              },
              {
                content: publication?.operations?.isNotInterested
                  ? "I'm interested"
                  : "Not interested",
                Icon: <EyeOff />,
                onClick: async () => {
                  try {
                    await toggleNotInterested({ publication });
                    toast({
                      title: "Success",
                      description: "Not interested toggled",
                    });
                  } catch (error) {
                    toast({
                      title: "Error",
                      variant: "destructive",
                      description: (error as { message: string }).message,
                    });
                  }
                },
              },

              publication?.by?.ownedBy?.address === address && {
                content: publication?.isHidden ? "Remove hide" : "Hide comment",
                Icon: <Ban />,
                onClick: async () => {
                  try {
                    const result = await toggleHidePublication({
                      publication,
                    });

                    toast({
                      title: "Success",
                      description: "Comment hidded",
                    });
                  } catch (error) {
                    console.log({ error });
                    toast({
                      title: "Error",
                      variant: "destructive",
                      description: (error as { message: string }).message,
                    });
                  }
                },
              },
              {
                content: publication?.operations?.hasBookmarked
                  ? "Remove bookmark"
                  : "Bookmark",
                Icon: <Bookmark />,
                onClick: async () => {
                  try {
                    console.log({ publication });
                    await toggleBookmark({ publication });
                    toast({
                      title: "Success",
                      description: "Bookmark toggled",
                    });
                  } catch (error) {
                    toast({
                      title: "Error",
                      variant: "destructive",
                      description: (error as { message: string }).message,
                    });
                  }
                },
              },
              {
                content: "Share",
                Icon: <SquareArrowUpRight />,
              },
              {
                content: "Translate",
                onClick: async () => {
                  const text = await translate();
                  if (text) {
                    setTextTranslate(text);
                  } else {
                    toast({
                      title: "Error Translate Model",
                      description:
                        "An error occured during translation. Please retry.",
                      variant: "destructive",
                    });
                  }
                },
                Icon: <Languages />,
              },
              {
                content: "Copy post text",
                Icon: <ClipboardCopy />,
              },
            ]
              .filter((el) => el)
              .map((el: any, i) => (
                <Button
                  variant={el?.variant}
                  onClick={el?.onClick}
                  key={`btn-publication-${publication.id}-${i}`}
                  className="gap-3 justify-between"
                >
                  {el?.content} {el?.Icon}
                </Button>
              ))}
            <ProfileBtnFollow profile={publication.by} />
          </div>
        </HoverCard>
        <div className="w-full">
          <div className="w-full">
            <div className="flex gap-10 items-center w-full">
              <Link
                href={`/profile/${by.ownedBy.address}`}
                className="mb-1 hover:text-info font-medium leading-none"
              >
                <ProfileName profile={by} showHandle />
              </Link>
              <p className="font-light text-xs opacity-50">
                {rest?.createdAt}
                {/* {dayjs(rest?.createdAt).fromNow()} */}
              </p>
            </div>
          </div>
          {publication.isEncrypted ? (
            <PublicationEncrypted publication={publication} />
          ) : (
            <div>
              <img
                className={cn(`
                            max-w-full sm:max-w-[500px]
                            rounded-2xl h-auto object-cover transition-all hover:scale-105
                            `)}
                src={
                  __typename === "Post"
                    ? (metadata as any)?.asset?.image?.optimized?.uri
                    : ""
                }
              />
              <article className="max-w-[800px] mt-4 break-words">
                <TextTruncated maxLength={200}>
                  {(
                    textTranslate || (metadata as { content: string })?.content
                  )?.replace(
                    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
                    "[LINK]($1)"
                  )}
                </TextTruncated>
              </article>
            </div>
          )}
          <div className="flex items-center   pointer-events-auto gap-3 mt-3 ">
            <Button
              onClick={(e: any) => {
                e.stopPropagation();
                if (!publication?.metadata) {
                  return;
                }
              }}
              className="rounded-full "
              variant={"ghost"}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {stats?.comments}
            </Button>
            <PublicationBtnCreateMirror publication={publication} />
            <PublicationBtnUpvotes publication={publication} />
            {publication.isEncrypted && (
              <Button variant="ghost">
                <HeartOff className="mr-2 h-4 w-4" />
                {stats?.downvotes}
              </Button>
            )}

            <Button className="rounded-full mr-1" variant={"ghost"}>
              <Grab className="mr-2 h-4 w-4" />
              {stats?.collects}
            </Button>
          </div>
          {publication?.publishedOn?.id && (
            <div
              onClick={
                appKnown && APP.id !== appKnown.id
                  ? () => window.open(appKnown.url, "_blank")
                  : undefined
              }
              className={cn(
                "flex items-end gap-2 opacity-50 hover:opacity-100 text-info text-xs  absolute bottom-3 right-0",
                appKnown && APP.id !== appKnown.id && "cursor-pointer"
              )}
            >
              {appKnown ? (
                <div className="">
                  <img
                    className="w-[34px] h-[34px] rounded-lg shadow"
                    src={appKnown.logo}
                    alt=""
                  />
                </div>
              ) : (
                <b className="font-black ">{publication?.publishedOn?.id}</b>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PublicationQuote = ({ publication }: PublicationProps) => {
  return (
    <div className="py-4 w-full  items-center  border-black/10  border-b ">
      <div className="flex pl-4 opacity-80 items-center gap-1 text-info ">
        <MessageSquare />
        <b>{publication?.by?.handle?.localName}</b>
        commented
      </div>
      <PublicationPost
        variants="commentary"
        publication={(publication as any).commentOn}
      />
      <PublicationPost
        variants={"commentary"}
        publication={{ ...publication } as any}
      />
    </div>
  );
};
