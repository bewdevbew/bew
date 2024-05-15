"use client";
import { Header } from "@/sections/layout/Header";

import React, { ReactNode } from "react";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};
