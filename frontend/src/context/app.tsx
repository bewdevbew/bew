"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAccount } from "wagmi";
import { FormProvider } from "./form";
import { Header } from "@/sections/layout/Header";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { DataTypes } from "../../contract/typechain/contracts/TokenReputation";
import { getContract, useContract } from "@/hooks/useContract";
import { useLogin, useSession } from "@lens-protocol/react-web";
import { TokenReputationType } from "@/types/dew/contract";

// Définition du type pour le contexte du formulaire
interface AppContextType {
  //   login: () => void;
  data: {
    token: TokenReputationType;
  };
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

// Création du contexte avec les types définis
const AppContext = createContext<AppContextType | undefined>(undefined);

const placeholderData: AppContextType["data"] = {
  token: {
    name: "",
    symbol: "",
    legacy: 0,
    supply: "0",
    network: "0x",
    balance: "0",
    address: "0x",
    rules: {} as any,
    events: {} as any,
  },
};

// Fournisseur du contexte du formulaire
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { contract: iFactory } = useContract("factory");
  const { contract: iToken } = useContract("token");
  // const { execute, loading, data: lens, error, ...rest } = useLogin();
  // const o = useSession();

  const { address } = useAccount();

  const login = async () => {
    if (address) {
      const tokenAddr = await iFactory.tokenOf(address);

      iToken.attach(tokenAddr as `0x${string}`);

      const balance = await iToken.balanceOf(address);
      const info = await iToken.getInfo();
      const events = await iToken.queryFilter(
        iToken.filters.NewTokenOnboarded()
      );

      const data: AppContextType["data"] = {
        token: {
          name: info.name,
          symbol: info.symbol,
          legacy: Number(info.legacy),
          supply: ethers.formatEther(info.totalSupply) as any,
          network: info.networkToken as "0x${string}",
          balance: ethers.formatEther(balance) as any,
          address: tokenAddr as `0x${string}`,
          rules: info.rules,
          events: {
            newTokenOnboarded: events
              .filter((el, i) => i < 10)
              .map(
                (el) =>
                  ({
                    ...el,
                    to: el.args.to,
                    token: el.args.token,
                    value: el.args.value,
                  } as any)
              ),
          },
        },
      };

      return data;
    }
  };

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: [address, "login"],
    queryFn: login,
    enabled: !!address,
  });

  return (
    <AppContext.Provider
      value={{
        data: isSuccess && data?.token ? data : placeholderData,
        isLoading,
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
export const useAuth = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useForm must be used within a AppProvider");
  }
  return context;
};
