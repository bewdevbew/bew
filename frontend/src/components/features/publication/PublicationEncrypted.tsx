import { ExplorePublication } from "@lens-protocol/react-web";

export const PublicationEncrypted = ({
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
