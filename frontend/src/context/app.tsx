"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAccount } from "wagmi";
import { FormProvider } from "./form";
import { Header } from "@/sections/layout/Header";

import { Profile, useSession } from "@lens-protocol/react-web";
import { TokenReputationType } from "@/types/dew/contract";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";

// Définition du type pour le contexte du formulaire
export interface AuthAppType {
  //   login: () => void;
  data: {
    token: TokenReputationType;
    lens: Profile | undefined;
  };
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

// Création du contexte avec les types définis
const AppContext = createContext<AuthAppType | undefined>(undefined);

// Fournisseur du contexte du formulaire
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <Layout>
      <FormProvider>
        <>
          <Header />
          {children}
        </>
      </FormProvider>
    </Layout>
  );
};

const Layout = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount();

  const { toast } = useToast();
  const { data: lens } = useSession();
  const { data, isLoading, isSuccess, isError } = useQuery({
    enabled: !!address,
    queryKey: [address, "authToken"],
    queryFn: async () =>
      await api({
        onError: toast,
        path: "/token/data",
        params: { adminAddress: address, peerAdminAddress: address },
      }),
  });

  return (
    <>
      <AppContext.Provider
        value={{
          data: {
            token: data as any,
            lens: (lens as any)?.profile as Profile,
          },
          isLoading,
          isError,
          isSuccess,
        }}
      >
        <>{children}</>
      </AppContext.Provider>
    </>
  );
};

// Hook pour utiliser le contexte du formulaire
export const useAuth = (): AuthAppType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAuth must be used within a AppProvider");
  }
  return context;
};
