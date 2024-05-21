"use client";
import {
  PublicationCard,
  PublicationLoading,
} from "@/components/features/publication/PublicationCard";

import { Card } from "@/components/ui/card";

import { useProfile } from "@/hooks/useApp";

import { AnyPublication, usePublications } from "@lens-protocol/react-web";

const PageProfile = ({ params }: { params: { address: `0x${string}` } }) => {
  const { data: profile } = useProfile({ address: params?.address });

  const {
    data: publications,
    loading,
    error,
  } = usePublications({
    where: {
      from: [profile.lens?.id as any],
    },
  });

  console.log({ publications, loading, error });
  return (
    <Card className="max-w-[700px]">
      <div className=" w-full divide-y">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <PublicationLoading key={`loading-card-${i}`} />
            ))
          : publications?.map((pub: AnyPublication, i) => (
              <div className="w-full " key={pub.id}>
                <PublicationCard publication={pub as any} />
              </div>
            ))}
      </div>
    </Card>
  );
};

export default PageProfile;
