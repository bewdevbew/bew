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

import { Card } from "@/components/ui/card";

import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";
import { IcGithub } from "@/constants/icon";
import { cn } from "@/utils/ui";
import { APP, LENS_APPS } from "@/constants/app";
import { ProfileAvatar } from "../profile/ProfileAvatar";
import { castLensAttributes } from "@/utils/lens";

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

export const PublicationLoading = ({}: {}) => {
  return (
    <>
      <div
        className={cn(
          `sm:px-6 px-2  relative w-full  flex pt-6 gap-3 mb-4 pb-2`
        )}
      >
        <div className="flex w-fit items-center flex-col">
          <Skeleton className="w-[45px] h-[45px] rounded-full" />
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center w-full">
              <Skeleton className="w-[100px] p-2" />
              <Skeleton className="w-[70px] p-2" />
            </div>
            <Skeleton className="w-[80px] p-1" />
          </div>

          <div className="flex flex-col gap-3">
            <Skeleton className={cn(`w-[500px] p-2`)} />
            <Skeleton className={cn(`w-[500px] p-2`)} />
          </div>
          <div className="flex gap-10 items-center">
            <Skeleton className="p-3 rounded-full" />
            <Skeleton className="p-3 rounded-full" />
            <Skeleton className="p-3 rounded-full" />
          </div>
        </div>
      </div>
    </>
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
  const { execute: toggleBookmark, loading, error } = useBookmarkToggle();
  const { execute: toggleNotInterested } = useNotInterestedToggle();
  const { execute: toggleHidePublication } = useHidePublication();

  const { toast } = useToast();
  const { address } = useAccount();

  const appKnown = LENS_APPS.find(
    (app) => app.id === publication?.publishedOn?.id
  );

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
          <ProfileAvatar profile={by} />
          {variants === "commentary" && (
            <>
              <div className="h-full w-1 bg-info/50 "></div>
            </>
          )}
        </div>
        {/* <ButtonDropdownMenu
          className="absolute top-0 right-0"
          groups={
            [
              [
                {
                  content: "Report Post",
                  variant: "error",
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
                  content: publication?.isHidden
                    ? "Remove hide"
                    : "Hide comment",
                  Icon: <Ban />,
                  onClick: async () => {
                    try {
                      console.log({ publication });
                      const result = await toggleHidePublication({
                        publication,
                      });
                      console.log({ publication, result });
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
                  Icon: <Languages />,
                },
                {
                  content: "Copy post text",
                  Icon: <ClipboardCopy />,
                },
              ],
            ] as any
          }
        /> */}
        <div className="w-full">
          <div className="w-full">
            <div className="flex gap-10 items-center w-full">
              <Link
                href={`/profile/${by?.id}`}
                className="mb-1 hover:text-info font-medium leading-none"
              >
                {by?.metadata?.displayName}
              </Link>
              <p className="font-light text-xs opacity-50">
                {rest?.createdAt}
                {/* {dayjs(rest?.createdAt).fromNow()} */}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {(by?.handle as any).localName}.{(by?.handle as any).namespace}
            </p>
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
                {(metadata as { content: string })?.content?.replace(
                  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
                  "[LINK]($1)"
                )}
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
                // setModal("POST_COMMENT", {
                //   publication: {
                //     ...publication,
                //     metadata: publication?.metadata || {},
                //   },
                // });
              }}
              className="rounded-full "
              variant={"ghost"}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {stats?.comments}
            </Button>
            {/* <BtnPublicationCreateMirror publication={publication} /> */}
            {/* <BtnPublicationUpvotes publication={publication} /> */}
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
                "flex items-end gap-2 opacity-50 hover:opacity-100 text-info text-xs ml-auto absolute top-3 right-5",
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

const PublicationEncrypted = ({
  publication,
}: {
  publication: ExplorePublication;
}) => {
  //   const ref = useRef(null);
  //   const isInView = useInView(ref);
  //   const { called, data, error, execute } = useLazyProfiles();

  //   const { execute: api, loading, data: decryptedContent } = useApi();

  //   const { toast } = useToast();

  //   const session = useSession();

  //   const [canDecrypt, setCanDecrypt] = useState<boolean>(false);

  //   const [conditions, setConditions] = useState<Record<
  //     string,
  //     {
  //       type: "profile" | "nft" | "key" | undefined;
  //       items: { type: "should" | "must" | "have"; label: string }[];
  //     }
  //   > | null>(null); // TODO retire profile / utilise la key / ajoute le type / et complète les autres conditions
  //   useEffect(() => {
  //     (async () => {
  //       if (conditions === null && session?.data?.authenticated && isInView) {
  //         if (called) return;
  //         const ids: string[] = [];
  //         let decrypt = false;
  //         publication?.metadata?.encryptedWith?.accessCondition?.criteria?.map(
  //           (el: any) => {
  //             const id = el?.profileId || el?.follow;

  //             if (!ids.includes(id) && id && id !== publication.by.id) {
  //               ids.push(id);
  //             }
  //           }
  //         );
  //         let data: Profile[] = [];
  //         if (ids.length) {
  //           const result = await execute({
  //             where: { profileIds: ids.map((el) => profileId(el)) },
  //           });

  //           if (result.isFailure()) {
  //             toast({
  //               title: "Error",
  //               description: "Failed to fetch profiles",
  //               variant: "destructive",
  //             });
  //           }

  //           data = (result as any)?.value;
  //         }

  //         const myProfile = (session as any)?.data?.profile as Profile;
  //         const c: Record<
  //           string,
  //           {
  //             type: "profile" | "nft" | "key" | undefined;
  //             items: { type: "should" | "must" | "have"; label: string }[];
  //           }
  //         > = {};
  //         for (
  //           let index = 0;
  //           index <
  //           (publication.metadata.encryptedWith?.accessCondition as any)?.criteria
  //             .length;
  //           index++
  //         ) {
  //           const e = (publication as any).metadata.encryptedWith?.accessCondition
  //             ?.criteria[index];
  //           let profileId = e?.profileId || e?.follow;
  //           let targetProfile = data?.find((d) => d.id === profileId);
  //           let targetElement = c[profileId] || {
  //             type: profileId ? "profile" : undefined,
  //             items: [],
  //           };

  //           if (e.__typename === "OrCondition") {
  //             for (let index = 0; index < e.criteria.length; index++) {
  //               const e2 = e.criteria[index];
  //               profileId = e2?.profileId || e2?.follow;
  //               targetElement = c[profileId] || {
  //                 type: profileId ? "profile" : undefined,
  //                 items: [],
  //               };
  //               let targetProfile = data?.find((d) => d.id === profileId);

  //               if (e2.__typename === "ProfileOwnershipCondition") {
  //                 targetElement.items.push({
  //                   type: myProfile?.id === profileId ? "have" : "should",
  //                   label: `Must owned`,
  //                 });
  //                 decrypt = myProfile?.id === profileId;
  //               }
  //               if (e2.__typename === "FollowCondition") {
  //                 targetElement.items.push({
  //                   type: targetProfile?.operations?.isFollowedByMe?.value
  //                     ? "have"
  //                     : "should",
  //                   label: `Must followed`,
  //                 });
  //                 if (!decrypt) {
  //                   decrypt = !!targetProfile?.operations?.isFollowedByMe?.value;
  //                 }
  //               }
  //             }
  //           }

  //           if (e.__typename === "ProfileOwnershipCondition") {
  //             targetElement.items.push({
  //               type: myProfile?.id === profileId ? "have" : "must",
  //               label: `Must owned`,
  //             });
  //             decrypt = myProfile?.id === profileId;
  //           }
  //           if (e.__typename === "FollowCondition") {
  //             targetElement.items.push({
  //               type: targetProfile?.operations.isFollowedByMe.value
  //                 ? "have"
  //                 : "must",
  //               label: `Must followed`,
  //             });
  //             decrypt = !!targetProfile?.operations.isFollowedByMe.value;
  //           }
  //           if (e.__typename === "NftOwnershipCondition") {
  //             try {
  //               const abis = {
  //                 ERC721: abisErc721,
  //               };

  //               const iContract = await contract(
  //                 (e as any).contract.address,
  //                 abis?.[e.contractType as keyof typeof abis]
  //               );

  //               const balance = await (iContract as any).balanceOf(
  //                 session.data.address
  //               );

  //               decrypt = balance > 0;
  //               targetElement.type = "nft";
  //               profileId = (e as any)?.contract?.address;
  //               targetElement.items.push({
  //                 type: balance > 0 ? "have" : "must",
  //                 label: `Must have NFT`,
  //               });
  //             } catch (error) {
  //               decrypt = false;
  //               targetElement.type = "nft";
  //               profileId = (e as any)?.contract?.address;
  //               targetElement.items.push({
  //                 type: "must",
  //                 label: `Must have NFT`,
  //               });
  //             }
  //           }
  //           if (profileId && targetElement.items.length) {
  //             c[profileId] = targetElement;
  //           }
  //         }
  //         setCanDecrypt(decrypt);
  //         setConditions(c);
  //       }
  //     })();

  //     // return () => setConditions(null);
  //   }, [isInView, session?.data?.authenticated]);

  //   const decodedString = isValidBase64(decryptedContent?.content)
  //     ? atob(decryptedContent?.content)
  //     : "";
  //   const decodedObject = isValidJSON(decodedString)
  //     ? JSON.parse(decodedString)
  //     : null;

  //   const { owner, repo } = {
  //     owner: publication?.metadata?.marketplace?.attributes?.find(
  //       (el) => el.traitType === "owner"
  //     )?.value,
  //     repo: publication?.metadata?.marketplace?.attributes?.find(
  //       (el) => el.traitType === "repo"
  //     )?.value,
  //   };

  //   useEffect(() => {
  //     (async () => {
  //       if (!canDecrypt || !session?.data?.authenticated) return;
  //       await api({
  //         args: {
  //           id: publication.id,
  //           profile_id: (session?.data as any)?.profile?.id,
  //         },
  //         url: "/publication",
  //         alert: false,
  //       });
  //     })();
  //   }, [publication.id, canDecrypt, (session as any)?.data?.profile?.id]);

  //   return (
  //     <div className="w-full mt-2 gap-2">
  //       {loading ? (
  //         <Skeleton className="h-[300px] w-full" />
  //       ) : decodedObject?.type === "Github" ? (
  //         <PublicationGithub
  //           publication={publication}
  //           decryptedContent={decryptedContent}
  //           decodedObject={decodedObject}
  //         />
  //       ) : (
  //         <>
  //           <Card className="mt-2">
  //             <div ref={ref} className="flex justify-between w-full">
  //               <motion.div className="flex gap-2 items-center font-light mb-2">
  //                 {canDecrypt ? (
  //                   <Unlock className="text-success" />
  //                 ) : (
  //                   <Lock className="text-error" />
  //                 )}
  //                 Post has been encrypted
  //               </motion.div>
  //               <Badge>Bêta</Badge>
  //             </div>
  //             <div className=" grid grid-cols-2 gap-5 mt-3">
  //               {Object.keys(conditions || {})?.map((key, i) => (
  //                 <div
  //                   className="flex flex-col gap-1 w-full"
  //                   key={`user-encrypted-data-${i}-${publication.id}`}
  //                 >
  //                   {conditions?.[key].type === "profile" ? (
  //                     <AvatarProfileFull
  //                       redirect
  //                       className="border shadow mb-2"
  //                       profile={
  //                         key === publication.by.id
  //                           ? publication.by
  //                           : data?.find((d) => d.id === key)
  //                       }
  //                     />
  //                   ) : (
  //                     conditions?.[key].type === "nft" && (
  //                       <div className="p-2 w-full border shadow rounded-lg flex flex-col mb-2">
  //                         <label className="font-bold">NFT</label>

  //                         <TextTruncated maxLength={10} hover>
  //                           {key}
  //                         </TextTruncated>
  //                       </div>
  //                     )
  //                   )}

  //                   {conditions?.[key]?.items?.map((el, j) => (
  //                     <div
  //                       key={`condition-encrypted-data-${i}-${j}-${publication.id}`}
  //                       className="flex items-center gap-4 font-light text-sm"
  //                     >
  //                       {
  //                         {
  //                           must: <BadgeCheck className="text-error" />,
  //                           have: <BadgeCheck className="text-success" />,
  //                           should: <BadgeCheck className="text-info" />,
  //                         }[el.type]
  //                       }

  //                       {el.label}
  //                     </div>
  //                   ))}
  //                 </div>
  //               ))}
  //             </div>

  //             {publication?.metadata?.appId === MYAPP.id &&
  //               (() => {
  //                 const result: { label: string; value: any }[] = [];

  //                 if (owner) result.push({ label: "Owner", value: owner });
  //                 if (repo) result.push({ label: "Repo", value: repo });
  //                 if (publication?.metadata?.marketplace?.description)
  //                   result.push({
  //                     label: "Description",
  //                     value: (
  //                       <p className="font-light opacity-80">
  //                         {publication?.metadata?.marketplace?.description}
  //                       </p>
  //                     ),
  //                   });

  //                 return result.length ? (
  //                   <div className="mt-3">
  //                     {result.map((el, i) => (
  //                       <div
  //                         className="flex flex-col "
  //                         key={`encrypted-desc-attributes-${i}-${publication.id}`}
  //                       >
  //                         <label className="opacity-80 font-bold text-sm">
  //                           {el.label}
  //                         </label>
  //                         <div className="font-semibold ">{el.value}</div>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 ) : (
  //                   <></>
  //                 );
  //               })()}
  //           </Card>
  //         </>
  //       )}
  //     </div>
  //   );

  return <> Publication Encrypted</>;
};

const PublicationGithub = ({
  publication,
  decodedObject,
  decryptedContent,
}: {
  decodedObject: { key: string; type: "Github" };
  decryptedContent: any;
  publication: ExplorePublication;
}) => {
  //     const attributes = castLensAttributes((publication as any)?.by?.metadata?.attributes);
  //   const github =attributes?.github
  //   // TODO
  //   const githubUsername = github
  // //   const githubUsername = searchGithubProfle(github as any);

  //   const { owner, repo } = {
  //     owner: publication?.metadata?.marketplace?.attributes?.find(
  //       (el) => el.traitType === "owner"
  //     )?.value,
  //     repo: publication?.metadata?.marketplace?.attributes?.find(
  //       (el) => el.traitType === "repo"
  //     )?.value,
  //   };
  //   const { toast } = useToast();

  // //   const { data } = useApi({
  // //     allowed: !!repo && !!owner,
  // //     url: "/github/invite-private",
  // //     alert: false,
  // //     args: { username: githubUsername, repo, owner },
  // //   });
  // //   const { data: repoData, invited } = data || {};

  //   console.log({ github, githubUsername, repoData, data, decryptedContent });
  //   const { execute: sendMyInvitation, data: inviteData } = useApi();
  //   if (!repoData) return <Skeleton className="h-[300px] w-full" />;
  //   return (
  //     <>
  //       <Card padding="" className="relative gap-1">
  //         <div className="p-2 flex items-center gap-2 opacity-80 font-light">
  //           <IcGithub className="text-sm" />
  //           Private repository
  //         </div>
  //         <Card className="bg-primary/5">
  //           <div className="flex justify-between">
  //             <a
  //               onClick={() => window.open(repoData?.html_url, "_blank")}
  //               className="hover:text-info text-lg font-semibold cursor-pointer"
  //             >
  //               {repoData?.name}
  //             </a>

  //             {repoData?.language && (
  //               <Badge className="h-full" variant="info">
  //                 {repoData?.language}
  //               </Badge>
  //             )}
  //           </div>
  //           <p className="text-sm font-extralight">
  //             Create at{" "}
  //             <span className="font-normal">{toDate(repoData?.createdAt)}</span>
  //           </p>
  //           <div className="flex items-center gap-1 my-1">
  //             <img
  //               className="rounded-full border shadow w-[25px] h-[25px]"
  //               src={repoData?.owner?.avatar_url}
  //               alt="avatar github profile"
  //             />
  //             <a
  //               className="hover:text-info text-sm font-semibold cursor-pointer"
  //               onClick={() => window.open(repoData?.owner?.html_url, "_blank")}
  //             >
  //               {repoData?.owner?.login}
  //             </a>
  //           </div>
  //           <div className="flex items-center gap-5 relative my-1">
  //             <Badge variant="destructive" className="flex items-center gap-5 ">
  //               <span className="opacity-80 ">Subscribers</span>
  //               <span className="text-xl font-bold">
  //                 {repoData?.subscribers_count}
  //               </span>
  //             </Badge>
  //             <Badge variant="warning" className="flex items-center gap-5 ">
  //               <span className="opacity-80 ">Watchers</span>
  //               <span className="text-xl font-bold">
  //                 {repoData?.watchers_count}
  //               </span>
  //             </Badge>
  //           </div>
  //           {publication?.metadata?.marketplace?.description && (
  //             <div className="my-2 flex flex-col 1">
  //               <label className="opacity-80 text-xs font-semibold">
  //                 Description
  //               </label>
  //               <p className="font-light text-sm">
  //                 {publication?.metadata?.marketplace?.description}
  //               </p>
  //             </div>
  //           )}{" "}
  //           <Card className="bg-primary/5 font-light flex-row my-3 gap-3">
  //             <Sparkles size={45} className="text-info " />

  //             <p className="text-sm opacity-80">
  //               You got an access for{" "}
  //               <span className="font-semibold">{repoData?.name}</span>{" "}
  //               repository.
  //               <br />
  //               We recommend that you clone this repository as soon as possible
  //               because nothing prevents{" "}
  //               <span className="font-semibold">
  //                 {repoData?.owner?.login}
  //               </span>{" "}
  //               from removing our access to this repository at any time.
  //             </p>
  //           </Card>
  //           <Button
  //             onClick={() => {
  //               if (invited) {
  //                 window.open(repoData?.html_url, "_blank");

  //                 return;
  //               }

  //               sendMyInvitation({
  //                 url: "/github/invite-private",
  //                 method: "POST",
  //                 args: {
  //                   username: githubUsername,
  //                   key: decodedObject.key,
  //                   repo,
  //                   owner,
  //                 },
  //               });

  //               toast({
  //                 title: "Success",
  //                 description:
  //                   "Invitation sent to join repository as collaborator",
  //               });
  //             }}
  //             className={"w-full"}
  //           >
  //             {invited ? "Open Repository" : "Join Repository"}
  //           </Button>
  //         </Card>
  //       </Card>
  //     </>
  //   );
  return <>Publication Github </>;
};
