import { useContext } from "react";

import { Client } from "@xmtp/xmtp-js";
import {
  AttachmentCodec,
  RemoteAttachmentCodec,
} from "@xmtp/content-type-remote-attachment";
import { ReplyCodec } from "@xmtp/content-type-reply";
import { ReactionCodec } from "@xmtp/content-type-reaction";
import { ReadReceiptCodec } from "@xmtp/content-type-read-receipt";
import { ClientContext } from "@/context/xmtp";
import { queryOptions, useQuery } from "@tanstack/react-query";

/**
 *
 * @notice xmtp est une messagerie crypté de bout en bout
 * qui utilise les wallets comme système d'authentification
 */

const ENCODING = "binary";

export const getEnv = (): "dev" | "production" | "local" => {
  return "production";
};

export const buildLocalStorageKey = (walletAddress: string) => {
  return walletAddress ? `xmtp:${getEnv()}:keys:${walletAddress}` : "";
};

export const loadKeys = (walletAddress: string): Uint8Array | null => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));

  return val ? Buffer.from(val, ENCODING) : null;
};

export const storeKeys = (walletAddress: string, keys: Uint8Array) => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING)
  );
};

export const wipeKeys = (walletAddress: string) => {
  // This will clear the conversation cache + the private keys
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};

export function useClientXmtp() {
  return useContext(ClientContext).client;
}

export function useSetClientXmtp() {
  const setClient = useContext(ClientContext).setClient;

  return (client: Client | null) => {
    if (client) {
      client.registerCodec(new AttachmentCodec());
      client.registerCodec(new RemoteAttachmentCodec());
      client.registerCodec(new ReplyCodec());
      client.registerCodec(new ReactionCodec());
      client.registerCodec(new ReadReceiptCodec());
    }

    setClient(client);
  };
}

export const useProfileXmtp = (address: `0x${string}` | undefined) => {
  const client = useClientXmtp();

  const fetchData = async () => {
    const conversations = await client?.conversations.list();

    return { conversations: conversations?.reverse().filter((_, i) => i < 50) };
  };

  return useQuery(
    queryOptions({
      enabled: !!address && !!client,

      queryKey: ["xmtp", address],
      queryFn: () => fetchData(),
      staleTime: 5 * 1000,
    })
  );
};
