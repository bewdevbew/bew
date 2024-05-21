"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAccount } from "wagmi";
import { FormProvider } from "./form";
import { Header } from "@/sections/layout/Header";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { DataTypes } from "../../contract/typechain/contracts/TokenReputation";
import { getContract, useContract } from "@/hooks/useContract";
import {
  Profile,
  useLastLoggedInProfile,
  useLogin,
  useSession,
} from "@lens-protocol/react-web";
import { TokenReputationType } from "@/types/dew/contract";
import { useProfile } from "@/hooks/useApp";

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

const placeholderData: AuthAppType["data"] = {
  token: {
    name: "",
    symbol: "",
    legacy: 0,
    supply: "0",
    network: "0x",
    balanceAdmin: "0",
    balanceNetwork: "0",
    balance: "0",
    address: "0x",
    rules: {} as any,
    events: {} as any,
  },
  lens: undefined,
};

// Fournisseur du contexte du formulaire
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { address } = useAccount();

  const { data, isLoading, isSuccess, isError, isFetched } = useProfile({
    address: address || "0x",
  });

  console.log({ data });

  return (
    <AppContext.Provider
      value={{
        data: isSuccess && data?.token ? data : placeholderData,
        isLoading: !isFetched,
        isError,
        isSuccess,
      }}
    >
      <FormProvider>
        <>
          <Header />
          {children}
        </>
      </FormProvider>
    </AppContext.Provider>
  );
};

// Hook pour utiliser le contexte du formulaire
export const useAuth = (): AuthAppType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useForm must be used within a AppProvider");
  }
  return context;
};
