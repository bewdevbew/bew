"use client";
import { useAuth } from "@/context/app";
import { useProfile } from "@/hooks/useApp";
import React from "react";

export default ({ params }: { params: { address: `0x${string}` } }) => {
  const { data: session } = useAuth();
  const { data: profile } = useProfile({ address: params.address });

  console.log({ session, profile });

  return <div>page</div>;
};
