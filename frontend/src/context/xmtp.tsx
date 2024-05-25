"use client";
import { Client } from "@xmtp/xmtp-js";
import { createContext, useState, ReactElement, useEffect } from "react";
import { useAccount } from "wagmi";
import { useEthersSigner } from "@/hooks/useWallet";
import { useClient } from "@xmtp/react-sdk";
import { loadKeys, storeKeys } from "@/hooks/useXmtp";

type ClientContextValue = {
  client: Client | null;
  setClient: (client: Client | null) => void;
};

export const ClientContext = createContext<ClientContextValue>({
  client: null,
  setClient: () => {
    return;
  },
});

export default function ClientProvider({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  const [client, setClient] = useState<Client | null>(null);

  const { address } = useAccount();
  const signer = useEthersSigner();
  const _client = useClient();

  useEffect(() => {
    if (!address || client?.address === address) return;
    (async () => {
      const options = {
        env: "dev",
      };

      let keys = loadKeys(address);

      if (!keys) {
        keys = await Client.getKeys(
          signer as any,
          {
            ...options,
            skipContactPublishing: true,
          } as any
        );
        storeKeys(address, keys);
      }
      const newClient = await _client?.initialize({
        keys,
        options: options as any,
        signer,
      });

      if (newClient) {
        setClient(newClient);
      }
    })();
  }, [address]);

  const clientContextValue = {
    client,
    setClient,
  };

  return (
    <ClientContext.Provider value={clientContextValue}>
      {children}
    </ClientContext.Provider>
  );
}
