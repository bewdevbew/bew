"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { hardhat, polygon, polygonMumbai } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { APP } from "@/constants/app";
import { ReactNode } from "react";

// connect kit doesn't export the config type, so we create it here
type ConnectKitConfig = Parameters<typeof getDefaultConfig>[0];

// differences in config between the environments
const appConfigs = {
  development: {
    connectkit: {
      chains: [hardhat],
      transports: {
        [hardhat.id]: http(),
      },
    } as Partial<ConnectKitConfig>,
    // lens: {
    //   environment: development,
    //   debug: true,
    // } as Partial<LensConfig>,
  },

  test: {
    connectkit: {
      chains: [polygonMumbai],
      transports: {
        [polygonMumbai.id]: http(),
      },
    } as Partial<ConnectKitConfig>,
    // lens: {
    //   environment: production,
    // } as Partial<LensConfig>,
  },
  production: {
    connectkit: {
      chains: [polygon],
      transports: {
        [polygon.id]: http(),
      },
    } as Partial<ConnectKitConfig>,
    // lens: {
    //   environment: production,
    // } as Partial<LensConfig>,
  },
};

const appConfig = appConfigs[process.env.NODE_ENV || "development"];

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: APP.name,
    ...appConfig.connectkit,
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    // Optional App Info
    // appDescription: "Your App Description",
    // appUrl: "https://family.co", // your app's url
    // appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
