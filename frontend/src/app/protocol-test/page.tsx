"use client";
import { getInfoProtocol, useProtocol } from "@/hooks/useProtocol";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

const page = () => {
  const { data } = useProtocol({});
  console.log({ data });

  return <div>page</div>;
};

export default page;
