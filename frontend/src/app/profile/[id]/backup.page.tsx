"use client";
// import { ProfileDewDetails } from "@/components/Profile/GET/ProfileDewDetails";
// import { ProfileGitDetails } from "@/components/Profile/GET/ProfileGitDetails";
// import { PublicationPost } from "@/components/Publications/POST/PublicationPost";
// import { ViewProfileMetadataIdentity } from "@/components/screens/Profile/ViewProfileMetadataIdentity";
// import { ViewProfilePubs } from "@/components/screens/Profile/ViewProfilePubs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
// import { ButtonDropdownMenu } from "@/components/ui/button/dropdown-menu";
// import { Tabs } from "@/components/ui/tabs";
import { IcGithub } from "@/constants/icon";
// import { useClientXmtp } from "@/hooks/useXmtp";
// import { searchAttributes } from "@/lib/utils";
import {
  Profile,
  PublicationType,
  profileId,
  useProfile,
  useSession,
} from "@lens-protocol/react-web";
import {
  BadgeCheck,
  BadgeMinus,
  BookOpenText,
  Coins,
  Edit,
  Globe,
  Hash,
  MapPinned,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
// import { useApi } from "@/hooks/useApi";

const PageProfile = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { address } = useAccount();
  const { data: profile } = useProfile({ forProfileId: profileId(id) });
  const { data: session } = useSession();
  console.log({ profile });

  const attributes = profile?.metadata?.attributes || [];
  //   const { location, website, github, role, available } = {
  //     location: searchAttributes("location", attributes),
  //     website: searchAttributes("website", attributes),
  //     github: searchAttributes("github", attributes),
  //     role: searchAttributes("role", attributes),
  //     available: searchAttributes("available", attributes),
  //   };

  //   const xmtp = useClientXmtp();
  const [allowXmtp, setAllowXmtp] = useState(false);

  //   const { execute: api } = useApi();
  //   useEffect(() => {
  //     (async () => {
  //       if (xmtp && profile?.ownedBy?.address) {
  //         const bool = await xmtp.canMessage(
  //           profile?.ownedBy?.address as `0x${string}`
  //         );

  //         setAllowXmtp(bool);
  //       }
  //     })();
  //   }, [profile?.ownedBy?.address, xmtp]);

  return (
    <main className="flex p-10 gap-5 justify-center flex-1">
      <div className="flex ">
        <Card>
          <h6>Total wadge</h6>
        </Card>

        {/* <Tabs
          className="items-end flex-col flex"
          groups={[
            {
              label: "Publications",
              content: (
                <>
                  {address && <PublicationPost address={address} />}
                  <ViewProfilePubs profileId={id} />
                </>
              ),
            },
            {
              label: "Dew Profile",
              content: profile?.ownedBy?.address ? (
                <ProfileDewDetails
                  address={profile?.ownedBy?.address as `0x${string}`}
                />
              ) : (
                <span>Loading dew profile</span>
              ),
            },
            {
              label: (
                <>
                  Workspace <Badge className="ml-4">Bêta</Badge>
                </>
              ) as unknown as string,
              value: "workspace",
              className: "gap-3 flex flex-col",
              content: (
                <>
                  <ProfileGitDetails profile={profile as Profile} />
                </>
              ),
            },
          ]}
        >
          <ButtonDropdownMenu
            title="Create"
            groups={[
              [
                {
                  Icon: <Edit />,
                  content: "Create new project",
                  path: `/create/project?w=${profile?.ownedBy.address}`,
                },
                {
                  Icon: <BookOpenText />,
                  content: "Create new content",
                  path: `/create/content`,
                },
                {
                  Icon: <Coins />,
                  content: "Create my token",
                  path: `/create/account`,
                },
              ],
            ]}
          />
        </Tabs> */}
      </div>
      <div className="flex flex-col">
        {/* <ViewProfileMetadataIdentity profile={profile} /> */}
        <div className="mt-10 opacity-80 flex flex-col  gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Hash />
            {profile?.id}
          </div>
          {/* {location && (
            <div className="flex items-center gap-3">
              <MapPinned />
              {location}
            </div>
          )}
          {github && (
            <div className="flex items-center gap-3">
              <IcGithub />
              {github}
            </div>
          )}
          {website && (
            <div className="flex items-center gap-3">
              <Globe />
              <a
                className="cursor-pointer hover:text-info"
                onClick={() => window.open(website, "_blank")}
              >
                {website}
              </a>
            </div>
          )}

          {role && (
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user"
              >
                <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.5 10-10 10s-10-4.48-10-10a10 10 0 0 1 10-10z" />
                <path d="M8 15s1-2 4-2 4 2 4 2" />
              </svg>
              {role}
            </div>
          )} */}
        </div>

        {/* {address === profile?.ownedBy?.address && (
          <div className="flex flex-col gap-2 py-10">
            <h6 className="font-semibold mb-2">Workflow account</h6>
            {[
              {
                label: "Connect your Notion Workspace",
                href: "/auth",
                bool: session?.authenticated,
              },
              {
                label: "Connect your Github account",
                href: "/auth",
                bool: !!github,
              },
              {
                label: "Mint your Onchain cv",
                href: "/create/account",
                bool: false,
              },
              {
                label: "Allow XMTP messaging",

                bool: allowXmtp,
              },
              {
                label: "Mint your Lens handler",
                href: "https://www.lens.xyz/mint",
                bool: !!profile,
              },
            ].map((el, i) => (
              <Link
                href={el.bool ? "#" : el?.href || "#"}
                key={`check-workflow-${i}`}
                className={`${
                  el?.bool ? "cursor-default" : "cursor-pointer"
                } flex items-center gap-3`}
              >
                {el?.bool ? (
                  <BadgeCheck className="text-green-600" />
                ) : (
                  <BadgeMinus className="text-error" />
                )}

                <p
                  className={` ${
                    el.bool ? "opacity-50" : "opacity-100"
                  } font-extralight text-xs`}
                >
                  {el.label}
                </p>
              </Link>
            ))}
          </div>
        )} */}
        <div className="flex max-w-[300px] mt-10  flex-wrap gap-2">
          {profile?.interests?.map((el, i) => (
            <div
              className="p-2 border-primary text-center border text-xs  rounded-full"
              key={`interest-${i}`}
            >
              {el.replace(/_/g, " ").toLowerCase()}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PageProfile;
