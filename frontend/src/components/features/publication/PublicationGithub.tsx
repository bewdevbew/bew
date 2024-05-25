import { ExplorePublication } from "@lens-protocol/react-web";

export const PublicationGithub = ({
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
