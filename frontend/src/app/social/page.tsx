"use client";
import { PublicationCard } from "@/components/features/publication/PublicationCard";
import { PublicationLoading } from "@/components/features/publication/PublicationLoading";
import {
  AnyPublication,
  useExplorePublications,
  usePublications,
} from "@lens-protocol/react-web";
import { Card } from "@tremor/react";
import React from "react";

export default () => {
  const { data: publications, loading, error } = useExplorePublications();

  console.log({ publications, loading, error });
  return (
    <main className="w-screen h-full flex items-center justify-center">
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
    </main>
  );
  return <div>page</div>;
};
